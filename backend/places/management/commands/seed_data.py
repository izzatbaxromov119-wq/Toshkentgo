"""
Demo ma'lumotlarni yuklash:

    python manage.py seed_data            # qo'shadi / yangilaydi (mavjudini o'chirmaydi)
    python manage.py seed_data --reset    # avval hamma joy, kategoriya va xabarlarni o'chiradi

DIQQAT: nomlar, telefonlar, email va koordinatalar TO'QIMA (namuna).
Haqiqiy ma'lumotni admin panel (/admin/) orqali kiriting.
"""
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify

from places.models import Amenity, Category, Notification, Place

# (slug, nomi, guruh slug'i, standart_boshi, premium_boshi)
# Narx chegaralari guruhda beriladi, turlar undan oladi.
CATEGORIES = [
    ("biznes", "Biznes ma'lumotnoma", None, None, None),
    ("avtosalon", "Avtosalonlar", "biznes", None, None),
    ("ijara", "Ijaradagi joylar", "biznes", None, None),
    ("turistik", "Turistik obyektlar", "biznes", None, None),

    # Ovqatlanish: o'rtacha chek (bir kishiga)
    ("ovqatlanish", "Ovqatlanish", None, 80_000, 200_000),
    ("fast-food", "Fast food", "ovqatlanish", None, None),
    ("milliy-taom", "Milliy taomlar", "ovqatlanish", None, None),
    ("turk-taom", "Turk taomlari", "ovqatlanish", None, None),

    # Kiyim: bitta buyum narxi
    ("kiyim", "Kiyim-kechak", None, 200_000, 600_000),
    ("kiyim-erkak", "Erkaklar kiyimi", "kiyim", None, None),
    ("kiyim-ayol", "Ayollar kiyimi", "kiyim", None, None),
    ("kiyim-bola", "Bolalar kiyimi", "kiyim", None, None),

    ("talim", "Ta'lim va bolalar", None, None, None),
    ("bogcha", "Kichik bog'chalar", "talim", None, None),
    ("oquv-markaz", "O'quv markazlari", "talim", None, None),

    ("sport", "Sport", None, None, None),
    ("gimnastika", "Gimnastika", "sport", None, None),
    ("boks", "Boks", "sport", None, None),
    ("fitness", "Fitness", "sport", None, None),
]

# Eski ma'lumotlar (avvalgi versiyalardan qolgani) — seed ishga tushganda o'chiriladi
OBSOLETE_CATEGORIES = ["savdo", "call-markaz"]
OBSOLETE_PLACES = ["Ovoz Call-Markaz"]

AMENITIES = [
    ("Wi-Fi", "wifi"), ("Avtoturargoh", "parking"),
    ("Konditsioner", "ac"), ("Yetkazib berish", "delivery"),
]


def P(name, cat, district, address, lat, lng, phone, price, unit, text, hours, amenities,
      discount=None, discount_text="", days=30, region="city", social="itf"):
    """Bitta joy tavsifi. social: i=Instagram, t=Telegram, f=Facebook."""
    return dict(
        name=name, cat=cat, district=district, address=address, lat=lat, lng=lng, phone=phone,
        price=price, unit=unit, text=text, hours=hours, amenities=amenities,
        discount=discount, discount_text=discount_text, days=days, region=region, social=social,
    )


PLACES = [
    # ---------- Biznes / ijara / turizm ----------
    P("Chilonzor Mehmon Uyi", "ijara", "Chilonzor", "Bunyodkor ko'chasi, 12", 41.2753, 69.2035,
      "+998 78 122 64 01", 150_000, "kecha", "Qulay va arzon xonalar, nonushta kiritilgan.", "24/7", ["wifi", "ac"],
      discount=10, discount_text="Hafta kunlari band qilinsa", days=20),
    P("Yunusobod Apart", "ijara", "Yunusobod", "Amir Temur shoh ko'chasi, 88", 41.3640, 69.2870,
      "+998 78 122 64 02", 420_000, "kecha", "Oilaviy apartamentlar, oshxonasi bor.", "24/7", ["wifi", "parking", "ac"]),
    P("Panorama Grand Hotel", "ijara", "Mirobod", "Mirobod ko'chasi, 5", 41.2870, 69.2700,
      "+998 78 122 64 03", 950_000, "kecha", "5 yulduzli mehmonxona, shahar manzarasi.", "24/7", ["wifi", "parking", "ac"]),
    P("Tele Minora Ko'rgazma Nuqtasi", "turistik", "Yunusobod", "Furqat ko'chasi, 2", 41.3396, 69.2852,
      "+998 78 122 64 04", 80_000, "dan", "Teleminora tomosha maydonchasi va muzey.", "10:00–21:00", ["parking"], social="it"),
    P("Chirchiq Dam Olish Maskani", "turistik", "Chirchiq", "Chirchiq daryosi bo'yi", 41.4690, 69.5820,
      "+998 78 122 64 14", 200_000, "kun", "Tabiat qo'ynida dam olish uylari.", "08:00–22:00", ["parking"], region="province"),
    P("Avto Markaz Toshkent", "avtosalon", "Sergeli", "Yangi Sergeli yo'li, 20", 41.2250, 69.2200,
      "+998 78 122 64 05", 100_000, "dan", "Yangi va ishlatilgan yengil avtomobillar savdosi, servis.", "09:00–19:00", ["parking", "wifi"]),

    # ---------- Ovqatlanish: Fast food ----------
    P("Burger Zone", "fast-food", "Chilonzor", "Chilonzor 7-kvartal", 41.2790, 69.2060,
      "+998 78 122 64 21", 32_000, "kishi", "Burger, kartoshka fri va ichimliklar. Combo menyular.", "10:00–00:00", ["wifi", "delivery"],
      discount=20, discount_text="Combo menyularga", days=14),
    P("Lavash House", "fast-food", "Yunusobod", "Yunusobod 9-mavze", 41.3660, 69.2840,
      "+998 78 122 64 22", 27_000, "kishi", "Tovuq va mol go'shtidan lavash, hot-dog.", "09:00–23:00", ["delivery"], social="it"),
    P("Crispy Chicken Point", "fast-food", "Mirzo Ulug'bek", "Mirzo Ulug'bek ko'chasi, 61", 41.3350, 69.3300,
      "+998 78 122 64 23", 95_000, "kishi", "Qarsildoq tovuq, wings va sous turlari.", "10:00–01:00", ["wifi", "parking", "ac", "delivery"]),
    P("Prime Burger Lounge", "fast-food", "Mirobod", "Mirobod ko'chasi, 21", 41.2880, 69.2720,
      "+998 78 122 64 24", 230_000, "kishi", "Premium mol go'shtidan gurme burgerlar va kraft ichimliklar.", "12:00–02:00", ["wifi", "parking", "ac"], social="itf"),

    # ---------- Ovqatlanish: Milliy taomlar ----------
    P("Toshkent Plov Markazi", "milliy-taom", "Shayxontohur", "Chorsu bozori yonida", 41.3224, 69.2287,
      "+998 78 122 64 31", 45_000, "kishi", "Har kuni yangi dam qilingan sof Toshkent oshi.", "11:00–15:00", ["parking"], social="it"),
    P("Dasturxon Milliy Taomlar", "milliy-taom", "Yakkasaroy", "Yakkasaroy ko'chasi, 40", 41.2920, 69.2580,
      "+998 78 122 64 32", 130_000, "kishi", "Somsa, manti, lag'mon, shashlik va nonlar.", "10:00–23:00", ["wifi", "parking", "ac"]),
    P("Registon Milliy Restoran", "milliy-taom", "Mirobod", "Amir Temur shoh ko'chasi, 4", 41.3058, 69.2794,
      "+998 78 122 64 33", 280_000, "kishi", "To'y va bazmlar uchun zallar, milliy shou-dastur.", "12:00–00:00", ["wifi", "parking", "ac"]),

    # ---------- Ovqatlanish: Turk taomlari ----------
    P("Istanbul Doner", "turk-taom", "Chilonzor", "Chilonzor 9-kvartal", 41.2810, 69.2100,
      "+998 78 122 64 41", 40_000, "kishi", "Tovuq va mol go'shtidan doner, ayran.", "10:00–23:00", ["delivery"],
      discount=25, discount_text="Ikkinchi porsiyaga", days=10),
    P("Lahmacun & Pide Ustasi", "turk-taom", "Olmazor", "Olmazor, Talabalar ko'chasi, 8", 41.3390, 69.2170,
      "+998 78 122 64 42", 55_000, "kishi", "Tandirda pishirilgan lahmacun va pide.", "10:00–23:00", ["wifi", "delivery"], social="it"),
    P("Anadolu Kebab House", "turk-taom", "Shayxontohur", "Navoiy ko'chasi, 55", 41.3210, 69.2450,
      "+998 78 122 64 43", 140_000, "kishi", "Adana, iskender va turli xil kebablar.", "11:00–00:00", ["wifi", "parking", "ac"]),
    P("Bosphorus Grand Restaurant", "turk-taom", "Mirobod", "Mustaqillik shoh ko'chasi, 12", 41.3040, 69.2830,
      "+998 78 122 64 44", 320_000, "kishi", "Boshfor manzarali zal, turk milliy taomlari va shirinliklari.", "12:00–00:00", ["wifi", "parking", "ac"]),

    # ---------- Kiyim-kechak ----------
    P("Erkaklar Olami", "kiyim-erkak", "Shayxontohur", "Chorsu savdo majmuasi, 2-qavat", 41.3250, 69.2330,
      "+998 78 122 64 51", 150_000, "dan", "Futbolka, ko'ylak, jinsi va kundalik kiyimlar.", "09:00–18:00", ["ac"],
      discount=30, discount_text="Barcha erkaklar kiyimiga", days=25),
    P("Urban Boys", "kiyim-erkak", "Yunusobod", "Yunusobod, Minor mavzesi", 41.3690, 69.2900,
      "+998 78 122 64 52", 110_000, "dan", "Yoshlar uchun ko'cha uslubidagi kiyimlar.", "10:00–21:00", ["wifi", "ac"]),
    P("Gentleman Classic", "kiyim-erkak", "Mirobod", "Mirobod ko'chasi, 30", 41.2890, 69.2740,
      "+998 78 122 64 53", 420_000, "dan", "Klassik kostyum, ko'ylak va poyabzal.", "10:00–20:00", ["ac", "parking"]),
    P("Milano Men Premium", "kiyim-erkak", "Mirobod", "Amir Temur shoh ko'chasi, 15", 41.3072, 69.2762,
      "+998 78 122 64 54", 1_200_000, "dan", "Italiya brendlari, buyurtma asosida tikish.", "11:00–21:00", ["wifi", "ac", "parking"], social="itf"),
    P("Elegance Ayollar Kiyimi", "kiyim-ayol", "Mirzo Ulug'bek", "Mirzo Ulug'bek ko'chasi, 44", 41.3380, 69.3340,
      "+998 78 122 64 55", 350_000, "dan", "Zamonaviy ayollar kiyimlari va aksessuarlar.", "10:00–21:00", ["ac", "wifi"]),
    P("Ayol Trend Outlet", "kiyim-ayol", "Sergeli", "Sergeli, Qatortol ko'chasi", 41.2256, 69.2289,
      "+998 78 122 64 56", 120_000, "dan", "Ko'ylak, yubka va kundalik kiyimlar arzon narxda.", "09:00–19:00", ["parking"], social="it"),
    P("Lola Boutique", "kiyim-ayol", "Yakkasaroy", "Yakkasaroy ko'chasi, 12", 41.2950, 69.2620,
      "+998 78 122 64 57", 850_000, "dan", "Kechki liboslar va dizayner kolleksiyalari.", "11:00–20:00", ["ac", "wifi"], social="itf"),
    P("Bolajon Kiyim Olami", "kiyim-bola", "Uchtepa", "Uchtepa, Kichik halqa yo'li, 7", 41.2967, 69.1856,
      "+998 78 122 64 07", 90_000, "dan", "0–12 yosh bolalar uchun kiyimlar.", "10:00–20:00", ["parking"]),
    P("Kichkintoy Premium", "kiyim-bola", "Yunusobod", "Yunusobod 11-mavze", 41.3700, 69.2800,
      "+998 78 122 64 58", 320_000, "dan", "Import bolalar kiyimlari, tug'ilgan kun to'plamlari.", "10:00–21:00", ["ac", "wifi"]),

    # ---------- Ta'lim ----------
    P("Quvnoq Bog'cha", "bogcha", "Yakkasaroy", "Yakkasaroy ko'chasi, 15", 41.2900, 69.2600,
      "+998 78 122 64 09", 1_200_000, "oy", "3–6 yosh bolalar uchun kichik guruhli bog'cha.", "07:30–18:30", ["ac", "wifi"]),
    P("Zukko O'quv Markazi", "oquv-markaz", "Olmazor", "Olmazor, Talabalar ko'chasi, 3", 41.3400, 69.2200,
      "+998 78 122 64 10", 450_000, "oy", "Ingliz tili va matematika kurslari.", "09:00–20:00", ["wifi", "ac"]),

    # ---------- Sport ----------
    P("Chempion Boks Klubi", "boks", "Chilonzor", "Chilonzor 9-kvartal", 41.2800, 69.2050,
      "+998 78 122 64 11", 250_000, "oy", "Bolalar va kattalar uchun boks mashg'ulotlari.", "07:00–21:00", ["parking"]),
    P("Grace Gimnastika Studiyasi", "gimnastika", "Yunusobod", "Yunusobod 4-mavze", 41.3600, 69.2800,
      "+998 78 122 64 12", 400_000, "oy", "Bolalar badiiy va sport gimnastikasi.", "09:00–20:00", ["ac", "wifi"]),
    P("Elite Fitness Club", "fitness", "Mirobod", "Mustaqillik maydoni yaqinida", 41.3065, 69.2780,
      "+998 78 122 64 13", 800_000, "oy", "Trenajyor zali, basseyn, sauna, shaxsiy trener.", "06:00–23:00", ["wifi", "parking", "ac"],
      discount=15, discount_text="Yillik obunaga", days=40),
]

# Do'kon va mehmonxonalarning call-markaz raqami: nom -> (raqam, ish vaqti). To'qima raqamlar.
CALL_CENTERS = {
    "Chilonzor Mehmon Uyi": ("+998 71 200 10 01", "24/7"),
    "Yunusobod Apart": ("+998 71 200 10 02", "24/7"),
    "Panorama Grand Hotel": ("+998 71 200 10 03", "24/7"),
    "Erkaklar Olami": ("+998 71 200 20 01", "09:00–20:00"),
    "Urban Boys": ("+998 71 200 20 02", "09:00–21:00"),
    "Gentleman Classic": ("+998 71 200 20 03", "09:00–20:00"),
    "Milano Men Premium": ("+998 71 200 20 04", "09:00–21:00"),
    "Elegance Ayollar Kiyimi": ("+998 71 200 20 05", "09:00–21:00"),
    "Ayol Trend Outlet": ("+998 71 200 20 06", "09:00–19:00"),
    "Lola Boutique": ("+998 71 200 20 07", "10:00–20:00"),
    "Bolajon Kiyim Olami": ("+998 71 200 20 08", "09:00–20:00"),
    "Kichkintoy Premium": ("+998 71 200 20 09", "09:00–21:00"),
}

SOCIAL_URLS = {"i": "https://instagram.com/", "t": "https://t.me/", "f": "https://facebook.com/"}


class Command(BaseCommand):
    help = "Demo kategoriya, qulaylik, joy va chegirmalarni bazaga yuklaydi"

    def add_arguments(self, parser):
        parser.add_argument("--reset", action="store_true", help="Avval eski ma'lumotlarni o'chirish")
        parser.add_argument("--if-empty", action="store_true", help="Faqat baza bo'sh bo'lsa yuklash")

    def handle(self, *args, **options):
        if options["if_empty"] and Place.objects.exists():
            self.stdout.write("Baza to'la — demo ma'lumot qayta yuklanmadi.")
            return

        if options["reset"]:
            Notification.objects.all().delete()
            Place.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write("Eski ma'lumotlar o'chirildi.")

        # 0) Eski joylarni olib tashlaymiz (kategoriya o'chirilishi uchun avval joylar o'chadi)
        Place.objects.filter(name__in=OBSOLETE_PLACES).delete()

        # 1) Kategoriyalar (guruhlar avval keladi, shuning uchun parent tayyor bo'ladi)
        cats = {}
        for order, (slug, name, parent_slug, std, prem) in enumerate(CATEGORIES):
            cats[slug], _ = Category.objects.update_or_create(
                slug=slug,
                defaults=dict(name=name, parent=cats.get(parent_slug), order=order,
                              standard_from=std, premium_from=prem),
            )
        for slug in OBSOLETE_CATEGORIES:  # bo'sh qolgan eski guruhni olib tashlaymiz
            Category.objects.filter(slug=slug, children__isnull=True, places__isnull=True).delete()

        # 2) Qulayliklar
        amenities = {icon: Amenity.objects.get_or_create(icon=icon, defaults={"name": name})[0]
                     for name, icon in AMENITIES}

        # 3) Joylar
        today = timezone.localdate()
        for p in PLACES:
            slug = slugify(p["name"])
            discount = p["discount"]
            values = dict(
                category=cats[p["cat"]], region=p["region"], district=p["district"], address=p["address"],
                latitude=p["lat"], longitude=p["lng"], phone=p["phone"],
                call_center=CALL_CENTERS.get(p["name"], ("", ""))[0],
                call_center_hours=CALL_CENTERS.get(p["name"], ("", ""))[1],
                email=f"info@{slug}.example.uz",
                instagram=SOCIAL_URLS["i"] if "i" in p["social"] else "",
                telegram=SOCIAL_URLS["t"] if "t" in p["social"] else "",
                facebook=SOCIAL_URLS["f"] if "f" in p["social"] else "",
                price_from=p["price"], price_unit=p["unit"],
                price_level="",  # yangi chegaralar bo'yicha qayta hisoblansin
                offerings=p["text"], description=p["text"], working_hours=p["hours"],
                discount_percent=discount, discount_text=p["discount_text"],
                discount_until=today + timedelta(days=p["days"]) if discount else None,
            )
            place, _ = Place.objects.update_or_create(name=p["name"], defaults=values)
            place.amenities.set([amenities[k] for k in p["amenities"]])

        self.stdout.write(self.style.SUCCESS(
            f"Tayyor: {Place.objects.count()} ta joy, {Category.objects.count()} ta kategoriya, "
            f"{Notification.objects.count()} ta xabar."
        ))
