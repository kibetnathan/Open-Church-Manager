from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Profile
from soft_delete import SoftDeleteAdminMixin


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = [
        "email",
        "username",
        "is_staff",
        "is_active",
    ]


class ProfileAdmin(SoftDeleteAdminMixin, admin.ModelAdmin):
    list_display = ["user", "phone_number", "is_deleted"]


admin.site.register(CustomUser, CustomUserAdmin,) 
admin.site.register(Profile, ProfileAdmin)