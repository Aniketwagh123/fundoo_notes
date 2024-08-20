import re
import json
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now

User = get_user_model()

# Define regex patterns for validation
EMAIL_REGEX = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$'
NAME_REGEX = r'^[A-Za-z]+$'


@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    missing_fields = []
    if not email:
        missing_fields.append('email')
    if not password:
        missing_fields.append('password')
    if not username:
        missing_fields.append('username')
    if missing_fields:
        return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)

    # Validate email with regex
    if not re.match(EMAIL_REGEX, email):
        return JsonResponse({'error': 'Invalid email address'}, status=400)

    # Validate password with regex
    if not re.match(PASSWORD_REGEX, password):
        return JsonResponse({'error': 'Password must be at least 8 characters long, with at least one letter and one number'}, status=400)

    # Validate first and last names
    if first_name and not re.match(NAME_REGEX, first_name):
        return JsonResponse({'error': 'First name must contain only alphabetic characters'}, status=400)
    if last_name and not re.match(NAME_REGEX, last_name):
        return JsonResponse({'error': 'Last name must contain only alphabetic characters'}, status=400)

    # Check if the email already exists
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already exists'}, status=400)

    # Create user
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )
        return JsonResponse({'message': 'User registered successfully'}, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    email = data.get('email', '').strip()
    password = data.get('password', '').strip()

    # Check for required fields
    if not email or not password:
        return JsonResponse({'error': 'Both email and password are required'}, status=400)

    # Validate email with regex
    if not re.match(EMAIL_REGEX, email):
        return JsonResponse({'error': 'Invalid email address'}, status=400)

    # Validate password with regex
    if not re.match(PASSWORD_REGEX, password):
        return JsonResponse({'error': 'Password must be at least 8 characters long, with at least one letter and one number'}, status=400)

    # Authenticate user
    user = authenticate(request, email=email, password=password)
    if user is not None:
        user.last_login = now()
        user.save()
        return JsonResponse({'message': 'Login successful'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid email or password'}, status=400)
