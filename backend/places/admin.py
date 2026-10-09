from django.contrib import admin

from .models import Amenity, Category, Favorite, Notification, Place, PlaceImage, Review


class PlaceImageInline(admin.TabularInline):
    model = PlaceImage
    extra = 1


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "region", "district", "price_from", "price_level", "discount_percent", "rating_avg", "is_active")
    list_filter = ("category", "region", "price_level", "is_active")
    search_fields = ("name", "address", "phone")
    filter_horizontal = ("amenities",)
    inlines = [PlaceImageInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "parent", "order", "standard_from", "premium_from")
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Amenity)
admin.site.register(Review)
admin.site.register(Favorite)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "place", "created_at")
    list_filter = ("kind",)
