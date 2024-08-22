from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),  # type: ignore
    }


def send_verification_email(user, verification_link):
    subject = 'Verify Your Email Address'

    html_message = render_to_string('email/verification_email.html', {
        'action_url': verification_link
    })
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    # raise (ImportError)
    send_mail(
        subject,
        html_message,
        email_from,
        recipient_list,
        html_message=html_message,
    )
