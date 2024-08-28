from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set default Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fundoo_notes.settings')

# Create Celery application
app = Celery('fundoo_notes')


# Load configuration from Django settings, using a namespace to prefix the celery-related settings.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in your Django apps
app.autodiscover_tasks()
