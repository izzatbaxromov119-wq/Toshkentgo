from rest_framework import serializers

from .models import Amenity, Category, Notification, Place, PlaceImage, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug", "parent")


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ("id", "name", "icon")


class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceImage
        fields = ("id", "image", "is_main")


def format_price(price, unit):
    """150000, 'kecha' -> "150 000 so'm / kecha" """
    if price is None:
        return "Narx so'raladi"
    text = f"{price:,}".replace(",", " ")
    return f"{text} so'm / {unit}" if unit != "dan" else f"{text} so'mdan"


class PlaceListSerializer(serializers.ModelSerializer):
    """Kartochkalar uchun — qisqa ma'lumot."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    price_text = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()   # faqat amal qilayotgan chegirma
    discount_price_text = serializers.SerializerMethodField()
    main_image = serializers.SerializerMethodField()
    amenities = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = (
            "id", "name", "slug", "category_name", "category_slug",
            "price_level", "price_from", "price_unit", "price_text",
            "discount_percent", "discount_text", "discount_until", "discount_price_text",
            "region", "district", "address", "latitude", "longitude", "phone", "call_center",
            "rating_avg", "reviews_count",
            "main_image", "amenities", "is_favorite",
        )

    def get_price_text(self, place):
        return format_price(place.price_from, place.price_unit)

    def get_discount_percent(self, place):
        return place.active_discount

    def get_discount_price_text(self, place):
        price = place.discounted_price
        return format_price(price, place.price_unit) if price is not None else None

    def get_main_image(self, place):
        images = list(place.images.all())  # prefetch qilingan, qo'shimcha so'rov yo'q
        if not images:
            return None
        main = next((img for img in images if img.is_main), images[0])
        request = self.context.get("request")
        return request.build_absolute_uri(main.image.url) if request else main.image.url

    def get_amenities(self, place):
        return [a.icon for a in place.amenities.all()]

    def get_is_favorite(self, place):
        return place.id in self.context.get("favorite_ids", set())


class PlaceDetailSerializer(PlaceListSerializer):
    """Batafsil sahifa uchun — to'liq ma'lumot."""

    category = CategorySerializer(read_only=True)
    images = PlaceImageSerializer(many=True, read_only=True)
    amenity_list = AmenitySerializer(source="amenities", many=True, read_only=True)

    class Meta(PlaceListSerializer.Meta):
        fields = PlaceListSerializer.Meta.fields + (
            "description", "offerings", "working_hours", "call_center_hours",
            "email", "website", "instagram", "telegram", "facebook",
            "category", "images", "amenity_list",
        )


class PlaceMapSerializer(serializers.ModelSerializer):
    """Xarita markerlari uchun — eng yengil variant."""

    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    price_text = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = (
            "id", "name", "slug", "latitude", "longitude", "price_level",
            "price_text", "discount_percent", "category_name", "category_slug", "address", "phone",
        )

    def get_price_text(self, place):
        return format_price(place.price_from, place.price_unit)

    def get_discount_percent(self, place):
        return place.active_discount


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = ("id", "user_name", "rating", "comment", "created_at")
        read_only_fields = ("id", "user_name", "created_at")


class NotificationSerializer(serializers.ModelSerializer):
    place_slug = serializers.SerializerMethodField()
    place_name = serializers.SerializerMethodField()
    discount_percent = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ("id", "kind", "title", "message", "place_slug", "place_name", "discount_percent", "created_at")

    def get_place_slug(self, n):
        return n.place.slug if n.place else None

    def get_place_name(self, n):
        return n.place.name if n.place else None

    def get_discount_percent(self, n):
        return n.place.active_discount if n.place else None
