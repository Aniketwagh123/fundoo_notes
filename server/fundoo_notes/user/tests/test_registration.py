import pytest
from rest_framework.reverse import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework_simplejwt.tokens import RefreshToken
import jwt

@pytest.mark.django_db
class TestUserRegistration:

    @pytest.fixture
    def url(self):
        return reverse('register_user')

    @pytest.fixture
    def valid_user_data(self):
        return {
            "first_name": "aniket",
            "last_name": "wagh",
            "email": "aniket1995@gmail.com",
            "password": "aniket564",
            "username": "user30"
        }

    def test_successful_registration(self, client, url, valid_user_data):
        response = client.post(url, valid_user_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert get_user_model().objects.filter(email=valid_user_data["email"]).exists()

    def test_missing_fields(self, client, url):
        incomplete_data = {
            "first_name": "aniket",
            "email": "aniket1995@gmail.com",
        }
        response = client.post(url, incomplete_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_duplicate_email(self, client, url, valid_user_data):
        # Register the user first
        client.post(url, valid_user_data, format='json')
        # Try registering the same user again
        response = client.post(url, valid_user_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data['errors']

    def test_password_too_short(self, client, url):
        user_data = {
            "first_name": "aniket",
            "last_name": "wagh",
            "email": "aniket1995@gmail.com",
            "password": "123",
            "username": "user30"
        }
        response = client.post(url, user_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data['errors']

    @patch('user.views.JWTUtil.encode_token')  # Ensure correct path
    def test_internal_server_error(self, mock_encode_token, client, url, valid_user_data):
        mock_encode_token.side_effect = Exception("Token generation error")
        response = client.post(url, valid_user_data, format='json')
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
