from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
import time

@shared_task
def send_verification_email_task(user_email, verification_link):
    """
    A Celery task to send the verification email to the user.
    """
    subject = 'Verify Your Email Address'
    html_message = render_to_string('email/verification_email.html', {
        'action_url': verification_link
    })
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user_email]
    # time.sleep(20)
    
    # Send email
    send_mail(
        subject,
        '',
        email_from,
        recipient_list,
        html_message=html_message,
    )



@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def my_task(self, *args, **kwargs):
    try:
        # Task logic here
        pass
    except Exception as exc:
        raise self.retry(exc=exc)