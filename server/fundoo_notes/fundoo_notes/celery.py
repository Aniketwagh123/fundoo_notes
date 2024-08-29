from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from loguru import logger
# Set default Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fundoo_notes.settings')

# Create Celery application
app = Celery('fundoo_notes')
app.conf.update(
    broker_connection_retry_on_startup=True,  # Maintain retry behavior on startup
    enable_utc=True,                         # Enable UTC for Celery
    timezone='ASIA/KOLKATA',                         # Set timezone to UTC
)

# Load configuration from Django settings, using a namespace to prefix the celery-related settings.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in your Django apps
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    logger.info(f'----- ?? Request: {self.request!r}')