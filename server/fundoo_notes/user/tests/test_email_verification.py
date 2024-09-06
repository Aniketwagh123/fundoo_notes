import pytest
from rest_framework.reverse import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from unittest.mock import patch
from jwt import ExpiredSignatureError, InvalidTokenError
from django.utils.timezone import now, timedelta
from user.utils.JWTUtil import JWTUtil
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestEmailVerification:

    @pytest.fixture
    def create_user(self):
        user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="testpassword123"
        )
        return user

    @pytest.fixture
    def generate_token(self, create_user):
        payload = {
            "user_id": create_user.id,
            "exp": now() + timedelta(hours=1),
            "aud": "register"
        }
        return JWTUtil.encode_token(payload)

    @pytest.fixture
    def expired_token(self, create_user):
        payload = {
            "user_id": create_user.id,
            "exp": now() - timedelta(hours=1),  # Token expired an hour ago
            "aud": "register"
        }
        return JWTUtil.encode_token(payload)

    @pytest.fixture
    def invalid_token(self):
        return "invalid_token_string"

    @pytest.fixture
    def verify_url(self, generate_token):
        return reverse('verify_email', args=[generate_token])

    def test_successful_verification(self, api_client, create_user, generate_token):
        url = reverse('verify_email', args=[generate_token])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == "User verified successfully"

        # Check if the user is marked as verified
        create_user.refresh_from_db()
        assert create_user.is_verified

    def test_user_already_verified(self, api_client, create_user, generate_token):
        create_user.is_verified = True
        create_user.save()

        url = reverse('verify_email', args=[generate_token])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['message'] == "User is already verified"

    def test_verification_with_expired_token(self, api_client, expired_token):
        url = reverse('verify_email', args=[expired_token])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['message'] == "Verification link has expired"

    def test_verification_with_invalid_token(self, api_client, invalid_token):
        url = reverse('verify_email', args=[invalid_token])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['message'] == "Invalid verification link"

    def test_user_does_not_exist(self, api_client, create_user):
        # Generate a token for a non-existing user
        payload = {
            "user_id": 9999,  # Invalid user_id
            "exp": now() + timedelta(hours=1),
            "aud": "register"
        }
        invalid_user_token = JWTUtil.encode_token(payload)
        url = reverse('verify_email', args=[invalid_user_token])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.data['message'] == "User not found"

    @patch('user.views.JWTUtil.decode_token')
    def test_internal_server_error(self, mock_decode_token, api_client, generate_token):
        mock_decode_token.side_effect = Exception("Unexpected error")
        url = reverse('verify_email', args=[generate_token])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        assert response.data['message'] == "An unexpected error occurred during verification"
