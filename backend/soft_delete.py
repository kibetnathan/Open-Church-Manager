"""
Shared soft-deletion primitives.

Any model that subclasses :class:`SoftDeleteModel` gets ``is_deleted`` /
``deleted_at`` columns and:
    * a default ``objects`` manager that hides soft-deleted rows
    * an ``all_objects`` manager that includes every row (used by the admin)
    * a ``delete()`` that soft-deletes by default and ``hard_delete()`` that
      removes the row permanently

The API layer soft-deletes through :class:`SoftDeleteViewSetMixin`. The admin
mixin (:class:`SoftDeleteAdminMixin`) shows all rows and hard-deletes, so a
record is only ever purged from the Django admin or by direct SQL.
"""

from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    """QuerySet whose ``delete()`` soft-deletes unless explicitly told otherwise."""

    def delete(self, hard=False):
        if hard:
            return super(SoftDeleteQuerySet, self).delete()
        return self.update(is_deleted=True, deleted_at=timezone.now())

    def hard_delete(self):
        return super(SoftDeleteQuerySet, self).delete()


class SoftDeleteManager(models.Manager):
    """Default manager — excludes soft-deleted rows."""

    def get_queryset(self):
        return (
            SoftDeleteQuerySet(self.model, using=self._db)
            .filter(is_deleted=False)
        )


class AllObjectsManager(models.Manager):
    """Unfiltered manager — includes soft-deleted rows."""

    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db)


class SoftDeleteModel(models.Model):
    """Abstract base for models that should never be hard-deleted through the API."""

    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False, hard=False):
        if hard:
            return super(SoftDeleteModel, self).delete(
                using=using, keep_parents=keep_parents
            )
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save(update_fields=["is_deleted", "deleted_at"])

    def hard_delete(self, using=None, keep_parents=False):
        return super(SoftDeleteModel, self).delete(
            using=using, keep_parents=keep_parents
        )


class SoftDeleteViewSetMixin:
    """Make DRF delete routes soft-delete their target instance."""

    def perform_destroy(self, instance):
        instance.delete()


class SoftDeleteAdminMixin:
    """
    Admin integration for soft-deletable models.

    The admin sees every row (including soft-deleted ones) and both the
    "delete selected" action and the single-object delete view hard-delete,
    keeping Django admin as the sanctioned hard-delete path.
    """

    def get_queryset(self, request):
        qs = self.model.all_objects.all()
        ordering = self.get_ordering(request)
        if ordering:
            qs = qs.order_by(*ordering)
        return qs

    def delete_model(self, request, obj):
        obj.hard_delete()

    def delete_queryset(self, request, queryset):
        if hasattr(queryset, "hard_delete"):
            queryset.hard_delete()
        else:
            queryset.delete()