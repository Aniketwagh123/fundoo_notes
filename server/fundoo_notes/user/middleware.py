from django.utils.deprecation import MiddlewareMixin
from .models import Log
from django.db.models import F 

class RequestLogMiddleware(MiddlewareMixin):
    """
    Custom middleware to log request data to the Log model.

    desc: Logs HTTP request method and URL to the database, 
    creating a new entry or updating an existing one by incrementing the count.
    """

    def process_request(self, request):
        """
        desc: 
            Process the incoming request and log method and URL.

        params: 
            request (HttpRequest): The HTTP request object.

        return: 
            None
        """
        method = request.method
        url = request.path

        # Try to update the count for the existing log entry
        updated = Log.objects.filter(
            method=method, url=url).update(count=F('count') + 1)

        # If no existing entry was found, create a new log entry
        if not updated:
            Log.objects.create(method=method, url=url, count=1)