from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from loguru import logger


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_reminder_email(self, note_id):
    """
    A Celery task to send a plain text reminder email to the user.
    """
    try:
        from .models import Note
        note = Note.objects.get(id=note_id)
        if note.reminder and not note.is_archive and not note.is_trash:
            subject = 'Reminder for your note'
            message = f'Here is your reminder for the note:\n\nTitle: {note.title}\nDescription: {note.description}'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [note.user.email]

            send_mail(
                subject,
                message,
                email_from,
                recipient_list,
                fail_silently=False,
            )
            logger.info(f"task on celery-bit done send mail to {recipient_list}")

        else:
            logger.info(
                f"Note {note_id} is either archived or in trash, or has no reminder set.")
    except Note.DoesNotExist:
        logger.error(f"Note with ID {note_id} does not exist.")
    except Exception as exc:
        logger.error(
            f"Failed to send reminder email for note {note_id}: {exc}")
        raise self.retry(exc=exc)
