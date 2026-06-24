from django.test import TestCase
from rest_framework.test import APIClient
from .models import CustomUser

class CurrentUserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            first_name="Test",
            last_name="User",
            password="testpassword"
        )

    def test_current_user_me_endpoint(self):
        self.client.force_authenticate(self.user)
        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["email"], "testuser@example.com")
        self.assertEqual(response.data["first_name"], "Test")
        self.assertEqual(response.data["last_name"], "User")
        self.assertEqual(response.data["id"], self.user.id)
