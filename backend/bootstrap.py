#!/usr/bin/env python3
"""
TashkentGo backend uchun ishga tushirish skripti.
Bu faylni to'g'ridan-to'g'ri ishga tushirish shart emas — start.bat / start.sh buni o'zi chaqiradi.

Qiladigan ishlari: Python versiyasini tekshiradi, virtual muhit (venv) yaratadi,
kerakli paketlarni o'rnatadi, bazani tayyorlaydi, demo ma'lumot va sinov admin yaratadi,
so'ng serverni ishga tushiradi. Xato chiqsa — tushunarli (o'zbekcha) xabar beradi va
oyna darrov yopilib ketmasligi uchun "Enter bosing" deb kutadi.
"""
import os
import subprocess
import sys
import venv
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VENV_DIR = ROOT / "venv"
IS_WINDOWS = os.name == "nt"
VENV_PY = VENV_DIR / ("Scripts/python.exe" if IS_WINDOWS else "bin/python")


def stop(message):
    """Xato bilan to'xtaydi — oyna darrov yopilib ketmasligi uchun kutib turadi."""
    print()
    print("[XATO] " + message)
    print()
    try:
        input("Chiqish uchun Enter bosing...")
    except EOFError:
        pass
    sys.exit(1)


def run(args, **kwargs):
    """Bitta buyruqni ishga tushiradi; muvaffaqiyatsiz bo'lsa, tushunarli xato bilan to'xtaydi."""
    try:
        subprocess.run(args, cwd=ROOT, check=True, **kwargs)
    except subprocess.CalledProcessError:
        stop(
            "Buyruq muvaffaqiyatsiz tugadi:\n  " + " ".join(str(a) for a in args) +
            "\nYuqoridagi xato matnini o'qing — odatda internet aloqasi yoki ruxsat bilan bog'liq."
        )
    except FileNotFoundError:
        stop(f"'{args[0]}' topilmadi. Python to'g'ri o'rnatilganini tekshiring.")


def check_python_version():
    if sys.version_info < (3, 10):
        v = f"{sys.version_info.major}.{sys.version_info.minor}"
        stop(
            f"Sizda Python {v} o'rnatilgan, lekin bu loyiha uchun Python 3.10 yoki undan yangisi kerak.\n"
            "Yangisini shu yerdan o'rnating: https://www.python.org/downloads/\n"
            'O\'rnatish oynasida pastdagi "Add python.exe to PATH" katagini albatta belgilang.'
        )


def ensure_venv():
    if VENV_PY.exists():
        return
    print("Virtual muhit yaratilmoqda (venv)... (birinchi marta biroz vaqt oladi)")
    try:
        venv.create(VENV_DIR, with_pip=True)
    except Exception as exc:  # noqa: BLE001
        stop(f"Virtual muhitni yaratib bo'lmadi: {exc}")
    if not VENV_PY.exists():
        stop("Virtual muhit yaratildi, lekin ichida python topilmadi. Python o'rnatilishini tekshiring.")


def ensure_env_file():
    env_path = ROOT / ".env"
    example_path = ROOT / ".env.example"
    if not env_path.exists() and example_path.exists():
        env_path.write_text(example_path.read_text(encoding="utf-8"), encoding="utf-8")
        print(".env fayli yaratildi (standart: SQLite baza).")


def main():
    print("===================================================")
    print("  TashkentGo backend")
    print("===================================================")

    check_python_version()
    ensure_venv()

    print("Paketlar tekshirilmoqda (birinchi marta biroz vaqt oladi)...")
    run([str(VENV_PY), "-m", "pip", "install", "--quiet", "--disable-pip-version-check", "-r", "requirements.txt"])

    ensure_env_file()

    # Baza ulanishini tekshiradi (PostgreSQL bo'lsa parol/server muammolarini tushunarli aytadi)
    result = subprocess.run([str(VENV_PY), "manage.py", "dbcheck", "--create"], cwd=ROOT)
    if result.returncode != 0:
        try:
            input("Chiqish uchun Enter bosing...")
        except EOFError:
            pass
        sys.exit(1)

    run([str(VENV_PY), "manage.py", "migrate"])
    run([str(VENV_PY), "manage.py", "seed_data", "--if-empty"])
    run([str(VENV_PY), "manage.py", "ensure_admin"])

    print("===================================================")
    print("  Backend: http://localhost:8000")
    print("  Admin panel: http://localhost:8000/admin/  (login: admin, parol: admin12345)")
    print("  To'xtatish uchun shu oynani yoping yoki Ctrl+C bosing.")
    print("===================================================")
    subprocess.run([str(VENV_PY), "manage.py", "runserver"], cwd=ROOT)


if __name__ == "__main__":
    main()
