import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from unittest.mock import patch

@pytest.mark.django_db
class TestUserLogin:
    
    @pytest.fixture
    def login_url(self):
        return reverse('login_user')

    @pytest.fixture
    def valid_login_data(self, user):
        return {
            'email': user.email,
            'password': 'securepassword'
        }

    @pytest.fixture
    def user(self):
        user = get_user_model().objects.create_user(
            email='testuser@example.com',
            password='securepassword',
            username='testuser',
            is_verified=True
        )
        return user

    def test_successful_login(self, client, user, login_url, valid_login_data):
        response = client.post(login_url, valid_login_data, content_type='application/json')
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data['tokens']
        assert 'refresh' in response.data['tokens']
        assert response.data['data']['email'] == user.email


    def test_unverified_user(self, client, login_url):
        unverified_user = get_user_model().objects.create_user(
            email='unverifieduser@example.com',
            password='securepassword',
            username='unverifieduser'
        )
        unverified_user.is_verified = False  # type: ignore # Set the user as unverified
        unverified_user.save()

        unverified_login_data = {
            'email': 'unverifieduser@example.com',
            'password': 'securepassword'
        }
        response = client.post(login_url, unverified_login_data, content_type='application/json')
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert 'message' in response.data
        assert response.data['message'] == 'User is not verified'

