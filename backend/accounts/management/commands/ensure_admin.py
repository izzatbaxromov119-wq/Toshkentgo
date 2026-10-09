"""
Ishlab chiqish (DEBUG) rejimida admin panelga kirish uchun oddiy admin yaratadi (agar hech qanday admin bo'lmasa):
    login: admin    parol: admin12345
Productionda ishlamaydi — u yerda `python manage.py createsuperuser` ishlating.
"""
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "DEBUG rejimida standart admin yaratadi (agar admin bo'lmasa)"

    def handle(self, *args, **options):
        if not settings.DEBUG:
            self.stdout.write("DEBUG o'chiq — admin avtomatik yaratilmadi. `createsuperuser` ishlating.")
            return
        User = get_user_model()
        if User.objects.filter(is_superuser=True).exists():
            return
        User.objects.create_superuser("admin", "admin@example.com", "admin12345")
        self.stdout.write(self.style.SUCCESS("Admin yaratildi:  login=admin  parol=admin12345  (faqat sinov uchun!)"))
