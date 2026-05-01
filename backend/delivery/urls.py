from django.urls import path
from . import views


urlpatterns = [
    path('auth/signin/', views.api_signin, name='api_signin'),
    path('auth/signup/', views.api_signup, name='api_signup'),
    path('auth/signout/', views.api_signout, name='api_signout'),
    path('me/', views.api_me, name='api_me'),
    path('dashboard/', views.api_dashboard, name='api_dashboard'),
    path('restaurants/', views.api_restaurants, name='api_restaurants'),
    path('restaurants/<int:id>/', views.api_restaurant_detail, name='api_restaurant_detail'),
    path('restaurants/<int:id>/menu/', views.api_restaurant_menu, name='api_restaurant_menu'),
    path('menu-items/<int:id>/', views.api_menu_item_detail, name='api_menu_item_detail'),
    path('cart/', views.api_cart, name='api_cart'),
    path('cart/add/<int:id>/', views.api_cart_add, name='api_cart_add'),
    path('cart/remove/<str:id>/', views.api_cart_remove, name='api_cart_remove'),
    path('cart/increase/<str:id>/', views.api_cart_increase, name='api_cart_increase'),
    path('cart/decrease/<str:id>/', views.api_cart_decrease, name='api_cart_decrease'),
    path('orders/checkout/', views.api_checkout, name='api_checkout'),
    path('orders/', views.api_orders, name='api_orders'),
    path('orders/<int:id>/status/', views.api_order_status, name='api_order_status'),
    path('payments/create-order/', views.api_payment_create, name='api_payment_create'),
    path('payments/verify/', views.api_payment_verify, name='api_payment_verify'),
]
