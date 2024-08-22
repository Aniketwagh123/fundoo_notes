import jwt
from rest_framework_simplejwt.settings import api_settings
from django.conf import settings

class JWTUtil:
    @staticmethod
    def encode_token(payload):
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=str(api_settings.ALGORITHM))

    @staticmethod
    def decode_token(token):
        return jwt.decode(token, settings.SECRET_KEY, algorithms=api_settings.ALGORITHM, audience='register')
