from django.contrib import admin
from .models import Post, Comment
from soft_delete import SoftDeleteAdminMixin


@admin.register(Post)
class PostAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date', 'is_deleted')


@admin.register(Comment)
class CommentAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ('post', 'author', 'created_at', 'is_deleted')