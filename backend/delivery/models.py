from django.db import models



from django.db import models



# Create your models here.

#for sign up 
class Customer(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    email = models.CharField(max_length=255)
    mobile = models.CharField(max_length=15)
    address = models.CharField(max_length=500)

    

#Django needs the Pillow library to handle images
# for install pillow
# python -m pip install Pillow


class Restaurant(models.Model):
    name = models.CharField(max_length=50)
    
    image_url = models.URLField(
        max_length=300,
        blank=True,
        null=True
    )

    image = models.ImageField(
        upload_to='restaurants/',
        blank=True,
        null=True
    )

    cuisine = models.CharField(max_length=200)
    rating = models.FloatField()

# orders for admin panel UI

class Order(models.Model):
    PAYMENT_PENDING = "pending"
    PAYMENT_PAID = "paid"
    PAYMENT_FAILED = "failed"

    STATUS_PLACED = "placed"
    STATUS_PREPARING = "preparing"
    STATUS_DELIVERED = "delivered"

    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)
    restaurant = models.ForeignKey('Restaurant', on_delete=models.CASCADE)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_address = models.CharField(max_length=200, blank=True)
    delivery_phone = models.CharField(max_length=15, blank=True)
    delivery_instructions = models.CharField(max_length=200, blank=True)
    payment_status = models.CharField(max_length=20, default=PAYMENT_PENDING)
    order_status = models.CharField(max_length=20, default=STATUS_PLACED)
    razorpay_order_id = models.CharField(max_length=120, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=120, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id}"
    
class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    price = models.FloatField()
    image = models.ImageField(upload_to="menu_images/", null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.username}'s review for {self.restaurant.name}"

# Coupon-related logic placeholder
class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    active = models.BooleanField(default=True)
