# urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LabelViewSet , RawLabelViewSet

router = DefaultRouter()
# router.register(r'', LabelViewSet, basename='label')
router.register(r'raw', RawLabelViewSet, basename='raw-label')

urlpatterns = [
    path('', include(router.urls)),
]
