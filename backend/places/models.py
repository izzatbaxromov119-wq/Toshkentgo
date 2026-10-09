"""
TashkentGo ma'lumotlar bazasi modellari.

Jadvallar:
  Category     — kategoriyalar (2 darajali: guruh -> tur), narx chegaralari bilan
  Amenity      — qulayliklar (Wi-Fi, avtoturargoh, ...)
  Place        — asosiy obyekt (do'kon, zal, restoran, ...), chegirma va ijtimoiy tarmoqlari bilan
  PlaceImage   — obyekt rasmlari
  Review       — sharhlar va reyting
  Favorite     — sevimlilar
  Notification — bildirishnomalar (masalan, yangi chegirma)
"""
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Avg
from django.utils import timezone
from django.utils.text import slugify

# Umumiy narx chegaralari (so'm). Kategoriyada o'z chegarasi bo'lmasa, shular ishlatiladi.
STANDARD_FROM = 300_000
PREMIUM_FROM = 700_000


class PriceLevel(models.TextChoices):
    BUDGET = "budget", "Budjet (arzon)"
    STANDARD = "standard", "Standart (o'rta)"
    PREMIUM = "premium", "Premium (qimmat)"


def price_to_level(price, thresholds=(STANDARD_FROM, PREMIUM_FROM)):
    """Narxga qarab darajani aniqlaydi. thresholds = (standart_boshi, premium_boshi)."""
    standard_from, premium_from = thresholds
    if price >= premium_from:
        return PriceLevel.PREMIUM
    if price >= standard_from:
        return PriceLevel.STANDARD
    return PriceLevel.BUDGET


class Category(models.Model):
    """
    Kategoriya. `parent` bo'sh bo'lsa — bu guruh (masalan, "Ovqatlanish").
    `parent` bor bo'lsa — bu tur (masalan, "Fast food").

    Narx chegaralari: 60 000 so'mlik tushlik "qimmat" bo'lishi mumkin, lekin 60 000 so'mlik
    ijara "arzon". Shuning uchun har bir guruhning o'z chegarasi bor; turlar guruhdan oladi.
    """

    name = models.CharField("Nomi", max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.CASCADE, related_name="children"
    )
    order = models.PositiveSmallIntegerField("Tartib raqami", default=0)
    standard_from = models.PositiveIntegerField(
        "Standart narx boshlanishi", null=True, blank=True,
        help_text="Shu narxdan boshlab 'Standart'. Bo'sh bo'lsa — guruhdan yoki umumiy qiymatdan.",
    )
    premium_from = models.PositiveIntegerField(
        "Premium narx boshlanishi", null=True, blank=True,
        help_text="Shu narxdan boshlab 'Premium'.",
    )

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"

    def __str__(self):
        return f"{self.parent.name} / {self.name}" if self.parent else self.name

    def thresholds(self):
        """O'zidan, bo'lmasa guruhidan, bo'lmasa umumiy chegaralarni qaytaradi."""
        node = self
        while node:
            if node.standard_from and node.premium_from:
                return node.standard_from, node.premium_from
            node = node.parent
        return STANDARD_FROM, PREMIUM_FROM


class Amenity(models.Model):
    """Qulaylik. `icon` — frontendda ikonka tanlash uchun kalit (wifi, parking, ac)."""

    name = models.CharField("Nomi", max_length=60)
    icon = models.CharField("Ikonka kaliti", max_length=30, unique=True)

    class Meta:
        verbose_name = "Qulaylik"
        verbose_name_plural = "Qulayliklar"

    def __str__(self):
        return self.name


class Place(models.Model):
    class Region(models.TextChoices):
        CITY = "city", "Toshkent shahri"
        PROVINCE = "province", "Toshkent viloyati"

    class PriceUnit(models.TextChoices):
        NIGHT = "kecha", "kecha"
        DAY = "kun", "kun"
        MONTH = "oy", "oy"
        SESSION = "mashg'ulot", "mashg'ulot"
        HOUR = "soat", "soat"
        PERSON = "kishi", "kishi (o'rtacha chek)"
        ITEM = "dan", "dan boshlab"

    # --- Asosiy ma'lumot ---
    name = models.CharField("Nomi", max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="places")
    description = models.TextField("Tavsif", blank=True)
    offerings = models.TextField(
        "Nima sotadi / nima qiladi", blank=True,
        help_text="Masalan: avtosalon uchun — qaysi mashinalar sotiladi.",
    )

    # --- Manzil va xarita ---
    region = models.CharField("Hudud", max_length=10, choices=Region.choices, default=Region.CITY)
    district = models.CharField("Tuman", max_length=100, blank=True)
    address = models.CharField("Manzil", max_length=255)
    latitude = models.DecimalField("Kenglik (lat)", max_digits=9, decimal_places=6)
    longitude = models.DecimalField("Uzunlik (lng)", max_digits=9, decimal_places=6)

    # --- Aloqa ---
    phone = models.CharField("Telefon", max_length=30)
    call_center = models.CharField(
        "Call-markaz raqami", max_length=30, blank=True,
        help_text="Do'kon yoki mehmonxonaning aloqa markazi (hotline) raqami.",
    )
    call_center_hours = models.CharField("Call-markaz ish vaqti", max_length=60, blank=True)
    email = models.EmailField("Email", blank=True)
    website = models.URLField("Sayt", blank=True)
    instagram = models.URLField("Instagram", blank=True)
    telegram = models.URLField("Telegram", blank=True)
    facebook = models.URLField("Facebook", blank=True)
    working_hours = models.CharField("Ish vaqti", max_length=100, blank=True)

    # --- Narx ---
    price_from = models.PositiveIntegerField("Narx (so'm)", null=True, blank=True)
    price_unit = models.CharField(
        "Narx birligi", max_length=20, choices=PriceUnit.choices, default=PriceUnit.ITEM
    )
    price_level = models.CharField(
        "Narx darajasi", max_length=10, choices=PriceLevel.choices, blank=True, db_index=True,
        help_text="Bo'sh qoldirsangiz, narxga va kategoriyaga qarab avtomatik aniqlanadi.",
    )

    # --- Chegirma ---
    discount_percent = models.PositiveSmallIntegerField(
        "Chegirma (%)", null=True, blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(90)],
        help_text="Chegirma yozilsa, foydalanuvchilarga avtomatik bildirishnoma yuboriladi.",
    )
    discount_text = models.CharField("Chegirma nimaga", max_length=150, blank=True)
    discount_until = models.DateField("Chegirma tugash sanasi", null=True, blank=True)

    # --- Reyting (Review'lardan avtomatik hisoblanadi) ---
    rating_avg = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    reviews_count = models.PositiveIntegerField(default=0)

    amenities = models.ManyToManyField(Amenity, blank=True, related_name="places")
    is_active = models.BooleanField("Faol", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-rating_avg", "-created_at"]
        verbose_name = "Joy"
        verbose_name_plural = "Joylar"
        indexes = [
            models.Index(fields=["latitude", "longitude"]),
            models.Index(fields=["region", "price_level"]),
            models.Index(fields=["discount_percent"]),
        ]

    def __str__(self):
        return self.name

    @property
    def active_discount(self):
        """Hozir amal qilayotgan chegirma foizi (muddati o'tgan bo'lsa — None)."""
        if not self.discount_percent:
            return None
        if self.discount_until and self.discount_until < timezone.localdate():
            return None
        return self.discount_percent

    @property
    def discounted_price(self):
        """Chegirmadan keyingi narx (yaxlitlangan, 100 so'mgacha)."""
        if self.price_from is None or not self.active_discount:
            return None
        return round(self.price_from * (100 - self.active_discount) / 100 / 100) * 100

    def save(self, *args, **kwargs):
        # 1) Slug (URL uchun nom) — avtomatik va takrorlanmas
        if not self.slug:
            base = slugify(self.name) or "joy"
            slug, n = base, 2
            while Place.objects.filter(slug=slug).exists():
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug

        # 2) Narx darajasi — narxga va kategoriyaga qarab avtomatik
        if not self.price_level and self.price_from is not None:
            self.price_level = price_to_level(self.price_from, self.category.thresholds())

        # 3) Chegirma o'zgargan bo'lsa — bildirishnoma yaratamiz
        update_fields = kwargs.get("update_fields")
        check_discount = update_fields is None or "discount_percent" in update_fields
        old_discount = None
        if check_discount and self.pk:
            old_discount = Place.objects.filter(pk=self.pk).values_list("discount_percent", flat=True).first()

        super().save(*args, **kwargs)

        if check_discount and self.discount_percent and self.discount_percent != old_discount:
            Notification.objects.create(
                kind=Notification.Kind.DISCOUNT,
                place=self,
                title=f"{self.name}: {self.discount_percent}% chegirma",
                message=self.discount_text or "Yangi chegirma e'lon qilindi",
            )

    def update_rating(self):
        """Sharhlar o'zgarganda o'rtacha reytingni qayta hisoblaydi."""
        stats = self.reviews.aggregate(avg=Avg("rating"))
        self.rating_avg = round(stats["avg"] or 0, 1)
        self.reviews_count = self.reviews.count()
        self.save(update_fields=["rating_avg", "reviews_count"])


class PlaceImage(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="places/")
    is_main = models.BooleanField("Asosiy rasm", default=False)

    class Meta:
        verbose_name = "Rasm"
        verbose_name_plural = "Rasmlar"

    def __str__(self):
        return f"{self.place.name} rasmi"


class Review(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField("Sharh", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            # Bitta foydalanuvchi bitta joyga bitta sharh qoldiradi
            models.UniqueConstraint(fields=["place", "user"], name="one_review_per_user"),
        ]
        verbose_name = "Sharh"
        verbose_name_plural = "Sharhlar"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.place.update_rating()

    def delete(self, *args, **kwargs):
        place = self.place
        super().delete(*args, **kwargs)
        place.update_rating()


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites"
    )
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "place"], name="one_favorite_per_user_place"),
        ]
        verbose_name = "Sevimli"
        verbose_name_plural = "Sevimlilar"


class Notification(models.Model):
    """
    Bildirishnoma (header'dagi qo'ng'iroqcha). Hamma foydalanuvchilarga ko'rinadi.
    Qaysi biri o'qilganini brauzerning o'zi eslab qoladi.
    """

    class Kind(models.TextChoices):
        DISCOUNT = "discount", "Chegirma"
        INFO = "info", "Xabar"

    kind = models.CharField(max_length=10, choices=Kind.choices, default=Kind.INFO)
    title = models.CharField("Sarlavha", max_length=200)
    message = models.CharField("Matn", max_length=255, blank=True)
    place = models.ForeignKey(
        Place, null=True, blank=True, on_delete=models.CASCADE, related_name="notifications"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Bildirishnoma"
        verbose_name_plural = "Bildirishnomalar"

    def __str__(self):
        return self.title
