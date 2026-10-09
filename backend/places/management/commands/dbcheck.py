"""
Bazaga ulanishni tekshiradi va xato bo'lsa, tushunarli tilda sababini aytadi.

    python manage.py dbcheck            # tekshirish
    python manage.py dbcheck --create   # PostgreSQL'da baza yo'q bo'lsa, yaratadi
"""
import re
import socket

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connection


def readable(exc):
    """Windows'da xato matni bo'sh yoki buzuq bo'lishi mumkin — turli kodlashlarda o'qib ko'radi."""
    parts = []
    for item in (exc, exc.__cause__):
        if item is None:
            continue
        for arg in getattr(item, "args", ()) or (str(item),):
            if isinstance(arg, bytes):
                for enc in ("utf-8", "cp1251", "cp866", "latin-1"):
                    try:
                        arg = arg.decode(enc)
                        break
                    except UnicodeDecodeError:
                        continue
            arg = str(arg).strip()
            if arg and not any(arg in existing or existing in arg for existing in parts):  # takrorlarni tashlaymiz
                parts.append(arg)
    lines = []
    for line in " ".join(parts).splitlines():  # bir xil qatorlar takrorlanmasin
        line = line.strip()
        if line and line not in lines:
            lines.append(line)
    text = "\n    ".join(lines)
    return text or "(xato matni bo'sh — Windows'da rus tilidagi xabarlar sababli shunday bo'ladi)"


class Command(BaseCommand):
    help = "Ma'lumotlar bazasiga ulanishni tekshiradi"

    def add_arguments(self, parser):
        parser.add_argument("--create", action="store_true", help="PostgreSQL'da baza bo'lmasa, yaratadi")

    def handle(self, *args, **options):
        db = settings.DATABASES["default"]

        # ---------- SQLite ----------
        if "sqlite" in db["ENGINE"]:
            connection.ensure_connection()
            self.stdout.write(self.style.SUCCESS(f"OK: SQLite bazasi ishlayapti ({db['NAME']})."))
            self.stdout.write("PostgreSQL ishlatish uchun backend/.env da DB_ENGINE=postgres qiling.")
            return

        # ---------- PostgreSQL ----------
        host, port = db["HOST"] or "localhost", int(db["PORT"] or 5432)
        self.stdout.write(f"PostgreSQL: {db['USER']}@{host}:{port}/{db['NAME']}")

        driver = self._driver()
        if driver is None:
            self.fail("PostgreSQL drayveri o'rnatilmagan.\n  Buyruq:  venv\\Scripts\\python -m pip install -r requirements-postgres.txt")

        try:
            socket.create_connection((host, port), timeout=3).close()
        except OSError as exc:
            self.fail(
                f"PostgreSQL serveri {host}:{port} da javob bermayapti ({exc}).\n"
                "  1) PostgreSQL o'rnatilganmi? https://www.postgresql.org/download/windows/\n"
                "  2) Ishlayaptimi? Windows: Win+R -> services.msc -> 'postgresql-x64-..' ni toping -> Start.\n"
                "  3) Port boshqa bo'lsa, .env dagi DB_PORT ni to'g'rilang."
            )

        if options["create"]:
            self._create_database(driver, db, host, port)

        try:
            connection.ensure_connection()
        except Exception as exc:  # noqa: BLE001 — hamma xatoni tushunarli qilib ko'rsatamiz
            self.fail(
                f"Ulanib bo'lmadi: {readable(exc)}\n"
                "  Ehtimoliy sabablar:\n"
                "  - Parol noto'g'ri  -> backend/.env dagi DB_PASSWORD ni tekshiring\n"
                "  - Foydalanuvchi noto'g'ri -> DB_USER (odatda 'postgres')\n"
                f"  - '{db['NAME']}' bazasi yo'q -> shu buyruq bilan yarating:  python manage.py dbcheck --create\n"
                "  Eng oson yo'l: DB_ENGINE=sqlite qiling — hech narsa o'rnatish shart emas."
            )
        self.stdout.write(self.style.SUCCESS("OK: PostgreSQL bazasiga ulandi."))

    def fail(self, message):
        self.stderr.write(self.style.ERROR("XATO: " + message))
        raise SystemExit(1)

    @staticmethod
    def _driver():
        for name in ("psycopg", "psycopg2"):
            try:
                return __import__(name)
            except ImportError:
                continue
        return None

    def _create_database(self, driver, db, host, port):
        name = db["NAME"]
        if not re.fullmatch(r"[A-Za-z0-9_]+", name):
            self.fail("Baza nomi faqat lotin harflari, raqam va _ dan iborat bo'lishi kerak.")
        try:
            conn = driver.connect(host=host, port=port, user=db["USER"], password=db["PASSWORD"], dbname="postgres")
            conn.autocommit = True
            cur = conn.cursor()
            cur.execute("SELECT 1 FROM pg_database WHERE datname = %s", (name,))
            if cur.fetchone():
                self.stdout.write(f"'{name}' bazasi allaqachon bor.")
            else:
                cur.execute(f'CREATE DATABASE "{name}"')
                self.stdout.write(self.style.SUCCESS(f"'{name}' bazasi yaratildi."))
            conn.close()
        except Exception as exc:  # noqa: BLE001
            self.fail(f"Bazani yaratib bo'lmadi: {readable(exc)}\n  Parol (DB_PASSWORD) va foydalanuvchi (DB_USER) to'g'rimi?")
