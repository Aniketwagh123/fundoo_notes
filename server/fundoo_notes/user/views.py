import re
import json
from django.forms import model_to_dict
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now

User = get_user_model()

# Define regex patterns for validation
EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'


@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(generate_response('Invalid JSON', 'error'), status=400)

    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    missing_fields = [field for field in [
        'email', 'password', 'username'] if not data.get(field)]
    if missing_fields:
        return JsonResponse(generate_response(f'Missing required fields: {", ".join(missing_fields)}', 'error'), status=400)

    # Validate email and password with regex
    if not re.match(EMAIL_REGEX, email):
        return JsonResponse(generate_response('Invalid email address', 'error'), status=400)
    if not re.match(PASSWORD_REGEX, password):
        return JsonResponse(generate_response('Password must be at least 8 characters long, with at least one letter and one number', 'error'), status=400)

    # Check if the email already exists
    if User.objects.filter(email=email).exists():
        return JsonResponse(generate_response('Email already exists', 'error'), status=400)

    # Create user
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        user_data = model_to_dict(user, exclude=['password'])
        return JsonResponse(generate_response('User registered successfully', 'success', user_data), status=201)
    except Exception as e:
        return JsonResponse(generate_response(str(e), 'error'), status=400)


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse(generate_response('Invalid JSON', 'error'), status=400)

    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    if not email or not password:
        return JsonResponse(generate_response('Both email and password are required', 'error'), status=400)

    # Authenticate user
    user = authenticate(request, email=email, password=password)
    if user:
        user.last_login = now()
        user.save()
        return JsonResponse(generate_response('User login successful', 'success'), status=200)
    else:
        return JsonResponse(generate_response('Invalid email or password', 'error'), status=400)


def generate_response(message: str, status: str, data=None):
    response = {
        "message": message,
        "status": status
    }
    if status == 'success' and data:
        response["data"] = data
    return response
