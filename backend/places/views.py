from django.db.models import F, Q
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Category, Favorite, Notification, Place, Review
from .serializers import (
    CategorySerializer,
    NotificationSerializer,
    PlaceDetailSerializer,
    PlaceListSerializer,
    PlaceMapSerializer,
    ReviewSerializer,
)

# Frontend yuborishi mumkin bo'lgan saralash variantlari
_BIG_DISCOUNT_FIRST = F("discount_percent").desc(nulls_last=True)

ALLOWED_ORDERING = {
    # Reyting teng bo'lsa (yangi saytda hammasi 0) — chegirmalilar birinchi
    "rating": ("-rating_avg", _BIG_DISCOUNT_FIRST, "id"),
    "cheap": ("price_from",),
    "expensive": ("-price_from",),
    "new": ("-created_at",),
    "discount": (_BIG_DISCOUNT_FIRST, "-rating_avg"),  # eng katta chegirma birinchi
}


def apply_filters(queryset, params):
    """
    So'rov parametrlari bo'yicha filtrlash. Masalan:
      /api/places/?price_level=budget&category=sport&region=city&q=boks
    """
    category = params.get("category")
    if category:
        # Guruh tanlansa, ichidagi barcha turlar ham chiqadi
        queryset = queryset.filter(Q(category__slug=category) | Q(category__parent__slug=category))

    if params.get("price_level"):
        queryset = queryset.filter(price_level=params["price_level"])

    # Faqat hozir amal qilayotgan chegirmalar (?has_discount=1)
    if params.get("has_discount") == "1":
        queryset = queryset.filter(discount_percent__gt=0).filter(
            Q(discount_until__isnull=True) | Q(discount_until__gte=timezone.localdate())
        )

    if params.get("region"):
        queryset = queryset.filter(region=params["region"])

    q = params.get("q")
    if q:
        queryset = queryset.filter(
            Q(name__icontains=q) | Q(address__icontains=q)
            | Q(district__icontains=q) | Q(description__icontains=q)
        )

    # Faqat raqam bo'lsa filtrlaymiz (aks holda xato bermaslik uchun)
    if params.get("min_price", "").isdigit():
        queryset = queryset.filter(price_from__gte=int(params["min_price"]))
    if params.get("max_price", "").isdigit():
        queryset = queryset.filter(price_from__lte=int(params["max_price"]))

    return queryset


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/categories/ — hammasi bir ro'yxatda (sahifalashsiz)."""

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
    lookup_field = "slug"


class PlaceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET  /api/places/                 — ro'yxat (filtr + sahifalash)
    GET  /api/places/<slug>/          — batafsil
    GET  /api/places/map/             — xarita markerlari (yengil)
    GET  /api/places/favorites/       — mening sevimlilarim
    POST /api/places/<slug>/favorite/ — sevimliga qo'shish / olib tashlash
    GET/POST /api/places/<slug>/reviews/ — sharhlar
    """

    lookup_field = "slug"

    def get_queryset(self):
        queryset = (
            Place.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related("images", "amenities")
        )
        queryset = apply_filters(queryset, self.request.query_params)
        ordering = ALLOWED_ORDERING.get(self.request.query_params.get("ordering"))
        return queryset.order_by(*ordering) if ordering else queryset

    def get_serializer_class(self):
        return PlaceDetailSerializer if self.action == "retrieve" else PlaceListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user = self.request.user
        # Foydalanuvchining sevimli joylari ID'lari (kartochkada yurakcha uchun)
        context["favorite_ids"] = (
            set(Favorite.objects.filter(user=user).values_list("place_id", flat=True))
            if user.is_authenticated else set()
        )
        return context

    @action(detail=False, methods=["get"], pagination_class=None)
    def map(self, request):
        """Xaritada ko'rsatish uchun barcha nuqtalar (sahifalashsiz)."""
        queryset = Place.objects.filter(is_active=True).select_related("category")
        queryset = apply_filters(queryset, request.query_params)
        return Response(PlaceMapSerializer(queryset, many=True).data)

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def favorites(self, request):
        places = self.get_queryset().filter(favorited_by__user=request.user)
        serializer = PlaceListSerializer(places, many=True, context=self.get_serializer_context())
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def favorite(self, request, slug=None):
        place = self.get_object()
        favorite, created = Favorite.objects.get_or_create(user=request.user, place=place)
        if not created:
            favorite.delete()
        return Response({"is_favorite": created})

    @action(detail=True, methods=["get", "post"], pagination_class=None)
    def reviews(self, request, slug=None):
        place = self.get_object()

        if request.method == "GET":
            return Response(ReviewSerializer(place.reviews.select_related("user"), many=True).data)

        if not request.user.is_authenticated:
            return Response({"detail": "Sharh yozish uchun tizimga kiring."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Bitta foydalanuvchi qayta yozsa — eski sharh yangilanadi
        review, _ = Review.objects.update_or_create(
            place=place, user=request.user, defaults=serializer.validated_data
        )
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class NotificationListView(generics.ListAPIView):
    """
    GET /api/notifications/ — oxirgi bildirishnomalar (qo'ng'iroqcha uchun).
    Muddati o'tgan chegirmalar chiqmaydi, bir joydan faqat eng yangi chegirma xabari qoladi.
    """

    serializer_class = NotificationSerializer
    pagination_class = None
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Notification.objects.filter(
            Q(place__isnull=True) | Q(place__is_active=True)
        ).select_related("place")

    def list(self, request, *args, **kwargs):
        result, seen_places = [], set()
        for n in self.get_queryset()[:60]:
            if n.kind == Notification.Kind.DISCOUNT:
                if not n.place or not n.place.active_discount or n.place_id in seen_places:
                    continue
                seen_places.add(n.place_id)
            result.append(n)
        return Response(self.get_serializer(result[:20], many=True).data)
