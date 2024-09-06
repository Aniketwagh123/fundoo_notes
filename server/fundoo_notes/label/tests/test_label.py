import pytest
from django.urls import reverse
from rest_framework import status
from ..models import Label
from loguru import logger

@pytest.fixture
def generate_usertoken(client, django_user_model):
    user = django_user_model.objects.create_user(
        email="sonalraj2001@gmail.com",
        password="Sonal@2002",
        username="abcksjd"
    )
    user.is_verified = True  # Set the user as verified
    user.save()

    data = {
        "email": "sonalraj2001@gmail.com",
        "password": "Sonal@2002",
    }
    url = reverse('login_user')
    response = client.post(url, data=data, content_type='application/json')
    # logger.info(response.data)
    return response.data["tokens"]["access"]


@pytest.fixture
def generate_usertoken2(client, django_user_model):
    user = django_user_model.objects.create_user(
        email="sonalraj2002@gmail.com",
        password="Sonal@2002",
        username="abcksjasdad"
    )
    user.is_verified = True  # Set the user as verified
    user.save()

    data = {
        "email": "sonalraj2002@gmail.com",
        "password": "Sonal@2002",
    }
    url = reverse('login_user')
    response = client.post(url, data=data, content_type='application/json')
    return response.data["tokens"]["access"]



@pytest.mark.django_db
@pytest.mark.labels_success
class TestLabels:
    
    @pytest.fixture
    def create_label(self, client, generate_usertoken):
        """Fixture to create a label"""
        url = reverse('label-list')
        data = {
            'name': 'Personal',
            'color': 'red'
        }
        response = client.post(
            url,
            data=data,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        return response.data

    # Test case 1: Create a label successfully
    def test_create_label_success(self, client, generate_usertoken):
        url = reverse('label-list')
        data = {
            'name': 'Work',
            'color': 'blue'
        }
        response = client.post(
            url,
            data=data,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['name'] == 'Work'
        assert response.data['color'] == 'blue'
    
    # Test case 2: Retrieve a specific label
    def test_retrieve_label(self, client, generate_usertoken, create_label):
        label_id = create_label['id']
        url = reverse('label-detail', args=[label_id])
        response = client.get(
            url,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == label_id

    # Test case 3: List all labels for a user
    def test_list_labels(self, client, generate_usertoken, create_label):
        url = reverse('label-list')
        response = client.get(
            url,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) > 0  # Ensure at least one label is returned

    # Test case 4: Update a label successfully
    def test_update_label(self, client, generate_usertoken, create_label):
        label_id = create_label['id']
        url = reverse('label-detail', args=[label_id])
        updated_data = {
            'name': 'Updated Label',
            'color': 'green'
        }
        response = client.put(
            url,
            data=updated_data,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Updated Label'
        assert response.data['color'] == 'green'

    # Test case 5: Delete a label successfully
    def test_delete_label(self, client, generate_usertoken, create_label):
        label_id = create_label['id']
        url = reverse('label-detail', args=[label_id])
        response = client.delete(
            url,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Label.objects.filter(id=label_id).exists()

    # Test case 6: Attempt to access another user's label (unauthorized)
    def test_retrieve_other_user_label(self, client, generate_usertoken2, create_label):
        label_id = create_label['id']
        url = reverse('label-detail', args=[label_id])
        response = client.get(
            url,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken2}'
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND

    # Test case 7: Invalid input data for label creation
    def test_create_label_invalid_data(self, client, generate_usertoken):
        url = reverse('label-list')
        data = {
            'name': '',  # Invalid: empty name
            'color': 'yellow'
        }
        response = client.post(
            url,
            data=data,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    
    # Test case 8: Unauthenticated user trying to create a label
    def test_create_label_unauthenticated(self, client):
        url = reverse('label-list')
        data = {
            'name': 'Work',
            'color': 'blue'
        }
        response = client.post(url, data=data, content_type='application/json')
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
    
    # Test case 9: Partial update of a label (PATCH)
    def test_partial_update_label(self, client, generate_usertoken, create_label):
        label_id = create_label['id']
        url = reverse('label-detail', args=[label_id])
        updated_data = {'name': 'Partially Updated'}
        response = client.patch(
            url,
            data=updated_data,
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {generate_usertoken}'
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Partially Updated'
