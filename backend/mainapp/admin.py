from django.contrib import admin
from .models import (
    LeadershipTeam,
    FellowshipGroup,
    Services,
    Department,
    Course,
    Equipment,
    ReadingPlan,
    CharityOrganisation,
)
from soft_delete import SoftDeleteAdminMixin


@admin.register(Services)
class ServicesAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'pastor', 'is_deleted')
    filter_horizontal = ('members',)  # nice multi-select for members


@admin.register(FellowshipGroup)
class FellowshipGroupAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'leader', 'is_deleted')
    filter_horizontal = ('members',)


@admin.register(LeadershipTeam)
class LeadershipTeamAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'is_deleted')
    filter_horizontal = ('members',)


@admin.register(Course)
class CourseAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'is_deleted')
    filter_horizontal = ('members',)


@admin.register(Department)
class DepartmentAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'leader', 'is_deleted')
    filter_horizontal = ('members',)


@admin.register(Equipment)
class EquipmentAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'assigned_service', 'assigned_department', 'is_deleted')


@admin.register(ReadingPlan)
class ReadingPlanAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('title', 'is_active', 'is_deleted')


@admin.register(CharityOrganisation)
class CharityOrganisationAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('name', 'pastor', 'is_deleted')