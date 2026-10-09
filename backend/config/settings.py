"""
TashkentGo — Django sozlamalari.
Muhim qiymatlar (parol, kalit) .env / muhit o'zgaruvchilaridan o'qiladi.
"""
import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def load_env_file(path):
    """
    backend/.env faylidagi KEY=VALUE qatorlarini o'qiydi (agar fayl bor bo'lsa).
    Haqiqiy muhit o'zgaruvchilari .env dan ustun turadi.
    """
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8-sig").splitlines():  # utf-8-sig: Notepad'ning BOM belgisi uchun
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file(BASE_DIR / ".env")


def env(name, default=""):
    """Muhit o'zgaruvchisini o'qiydigan kichik yordamchi."""
    return os.environ.get(name, default)


SECRET_KEY = env("DJANGO_SECRET_KEY", "dev-secret-key-buni-productionda-almashtiring")
DEBUG = env("DJANGO_DEBUG", "True") == "True"
ALLOWED_HOSTS = env("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Uchinchi tomon
    "rest_framework",
    "corsheaders",
    # Bizning ilovalar
    "accounts",
    "places",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # eng tepada bo'lishi kerak
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ---------- Ma'lumotlar bazasi ----------
# Standart: SQLite (fayl: backend/db.sqlite3) — hech narsa o'rnatish shart emas, har qanday kompyuterda ishlaydi.
# PostgreSQL uchun backend/.env faylida DB_ENGINE=postgres va DB_* qiymatlarini yozing
# (tekshirish: python manage.py dbcheck).
if env("DB_ENGINE", "sqlite").lower() in ("postgres", "postgresql"):
    try:
        import psycopg  # noqa: F401
    except ImportError:
        try:
            import psycopg2  # noqa: F401
        except ImportError:
            from django.core.exceptions import ImproperlyConfigured

            raise ImproperlyConfigured(
                "PostgreSQL drayveri o'rnatilmagan. Buyruq:  python -m pip install -r requirements-postgres.txt   "
                "(yoki backend/.env da DB_ENGINE=sqlite qiling — hech narsa o'rnatish shart emas)."
            ) from None
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": env("DB_NAME", "tashkentgo"),
            "USER": env("DB_USER", "postgres"),
            "PASSWORD": env("DB_PASSWORD", "postgres"),
            "HOST": env("DB_HOST", "localhost"),
            "PORT": env("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Django 5 va 6 da bir xil ishlashi uchun (W042 ogohlantirishini yo'qotadi)
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

# ---------- Django REST Framework + JWT ----------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    # Standart: hamma ko'ra oladi, faqat kirgan foydalanuvchi o'zgartira oladi
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ---------- CORS (React bilan aloqa) ----------
CORS_ALLOWED_ORIGINS = [env("FRONTEND_URL", "http://localhost:5173")]
CORS_ALLOW_ALL_ORIGINS = DEBUG  # faqat ishlab chiqishda; productionda False bo'ladi
