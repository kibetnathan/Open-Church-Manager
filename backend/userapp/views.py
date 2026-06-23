from django.db import transaction
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect, get_object_or_404
from .models import CustomUser, Profile
from .serializers import UserSerializer, ProfileSerializer, GroupSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .forms import CustomRegistrationForm
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import Group
from firebase_admin import auth, exceptions


class ProfileViewSet(viewsets.ModelViewSet):
    """
    Router-backed CRUD for Profile, keyed by the related user's id rather than the
    Profile's own pk. This lets the frontend address profiles as `/profiles/{user_id}/`,
    which matches how user records are referenced elsewhere in the app.

    Routes (router prefix 'profiles/'):
        GET    /profiles/              — list all profiles
        POST   /profiles/              — create a profile
        GET    /profiles/{user_id}/    — retrieve the profile for the given user
        PUT    /profiles/{user_id}/    — replace that profile
        PATCH  /profiles/{user_id}/    — partial update
        DELETE /profiles/{user_id}/    — delete that profile
    """

    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all().order_by("id")
    serializer_class = ProfileSerializer

    def get_object(self):
        print(f"DEBUG: Looking up Profile with user_id={self.kwargs['pk']}")
        return get_object_or_404(Profile, user_id=self.kwargs["pk"])

    def update(self, request, *args, **kwargs):
        print(f"DEBUG: Update request data: {request.data}")
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            print(f"DEBUG: Error during update: {e}")
            raise


class RegistrationAPIView(APIView):
    """
    Finalise registration for an already-authenticated user.

    The user is created by the Firebase sign-up flow; this endpoint runs the
    CustomRegistrationForm against the current user to fill in the remaining profile
    fields inside a single transaction. On success returns the serialised user (201);
    on form errors returns 400; on unexpected failure rolls back and returns 500.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Validate and persist registration data for `request.user`."""
        form = CustomRegistrationForm(request.data, instance=request.user)
        if not form.is_valid():
            return Response(form.errors, status=400)

        try:
            with transaction.atomic():
                user = form.save()
        except Exception as e:
            return Response(
                {
                    "detail": "Profile creation failed. Please try again.",
                    "error": str(e),
                },
                status=500,
            )

        return Response({"user": UserSerializer(user).data}, status=201)


class UsernameCheckAPIView(APIView):
    """
    Public availability check used by the sign-up form.

    Enforces length rules (3–30 chars) and performs a case-insensitive uniqueness
    check against CustomUser. Returns `{available: bool, reason?: str}` so the
    frontend can show inline feedback before the user submits.

    Route: GET /username-check/?username=<value>
    """

    permission_classes = [AllowAny]

    def get(self, request):
        """Return whether the supplied `?username=` is free to register."""
        username = request.query_params.get("username", "").strip()

        if not username:
            return Response({"error": "No username provided."}, status=400)

        if len(username) < 3:
            return Response(
                {
                    "available": False,
                    "reason": "Username must be at least 3 characters.",
                }
            )

        if len(username) > 30:
            return Response(
                {
                    "available": False,
                    "reason": "Username must be 30 characters or fewer.",
                }
            )

        exists = CustomUser.objects.filter(username__iexact=username).exists()
        return Response({"available": not exists})


class CurrentUserAPIView(APIView):
    """
    Return a compact representation of the authenticated user.

    Used by the frontend on load to hydrate the session: id, username, names, email,
    and the names of the groups the user belongs to (so the UI can gate role-specific
    features without extra round-trips).

    Route: GET /me/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return the identity and group memberships of `request.user`."""
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "groups": [group.name for group in user.groups.all()],
            }
        )


class GroupListView(APIView):
    """
    List every Django auth Group.

    Intended for admin screens that assign members to roles (Pastors, Leaders, etc.);
    returns all groups, not just those the current user belongs to.

    Route: GET /groups/
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return every Group defined in the system."""
        groups = Group.objects.all()  # Get ALL groups instead of user.groups.all()
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD for CustomUser, with Firebase-aware delete and guarded email updates.

    Non-owners cannot change another user's email even if they have write access, and
    deleting a user also removes the corresponding Firebase Auth account so the two
    systems stay in sync.

    Routes (router prefix 'users/'):
        GET    /users/         — list users
        POST   /users/         — create a user
        GET    /users/{id}/    — retrieve a user
        PUT    /users/{id}/    — replace a user (email stripped for non-owners)
        PATCH  /users/{id}/    — partial update (same email guard)
        DELETE /users/{id}/    — delete from Django + Firebase Auth
    """

    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all().order_by("id")
    serializer_class = UserSerializer

    def update(self, request, *args, **kwargs):
        """Update a user, stripping `email` from the payload if the requester isn't the owner."""
        instance = self.get_object()
        if request.user != instance and "email" in request.data:
            data = request.data.copy()
            data.pop("email")
            request._full_data = data
        return super().update(request, *args, **kwargs)

    def perform_destroy(self, instance):
        """
        Custom destroy logic to sync with Firebase.
        """
        if instance.firebase_uid:
            try:
                # Delete the user from Firebase Auth
                auth.delete_user(instance.firebase_uid)
            except exceptions.NotFoundError:
                # If the user is already gone from Firebase, we can proceed
                pass
            except exceptions.FirebaseError as e:
                # If it's a network or permission error, you might want
                # to raise an exception to prevent the Django user from being deleted
                raise Exception(f"Firebase deletion failed: {str(e)}")
        instance.delete()
