from django.shortcuts import render, redirect, get_object_or_404
from .models import Customer, Restaurant, Order, MenuItem

from django.db.models import Sum
from django.utils import timezone


import razorpay
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt


# Create your views here.


#index page
def index(request):
    return render(request, 'index.html')

#sign in page


def signin(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        # 🔹 Check if admin
        if username == "admin":
            request.session['admin'] = username
            return render(request, 'admin_home.html')

        # 🔹 Check normal customer
        from .models import Customer
        user = Customer.objects.filter(username=username, password=password).first()

        if user:
            request.session['username'] = username
            return redirect('customer_home')
        else:
            return render(request, 'signin.html', {'error': 'Invalid credentials'})

    return render(request, 'signin.html')


#sign up page
def signup(request):
    error = None
    # it saves the customer details on admin panel for CRUD operation
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        mobile = request.POST['mobile']
        address = request.POST['address']

         # same username + password check
        if Customer.objects.filter(username=username, password=password).exists():
            error = "Account already exists with same username and password"
        else:
            Customer.objects.create(
                username=username,
                email=email,
                password=password,
                mobile=mobile,
                address=address
            )
            return redirect('signin')

    return render(request, 'signup.html', {'error': error})





# ✅ DELETE RESTAURANT (STAYS ON SAME PAGE)
def delete_restaurant(request, id):
    restaurant = get_object_or_404(Restaurant, id=id)
    restaurant.delete()
    return redirect('show_restaurant')   # ✅ redirect by URL NAME






def show_restaurant(request):
    restaurants = Restaurant.objects.all()
    return render(request, "show_restaurant.html", {"restaurants": restaurants})






def admin_home(request):

    #  Total Users
    total_users = Customer.objects.count()

    #  Active Users
    active_users = Customer.objects.count()


    # Total Restaurants
    total_restaurants = Restaurant.objects.count()

    #  Total Orders
    total_orders = Order.objects.count()

    #  Total Revenue
    total_revenue = Order.objects.aggregate(
        total=Sum('total_price')
    )['total'] or 0

    #  Today's Revenue
    today = timezone.now().date()
    todays_revenue = Order.objects.filter(
        created_at__date=today
    ).aggregate(
        total=Sum('total_price')
    )['total'] or 0

    context = {
        'total_users': total_users,
        'active_users': active_users,
        'total_restaurants': total_restaurants,
        'total_orders': total_orders,
        'total_revenue': total_revenue,
        'todays_revenue': todays_revenue,
    }

    return render(request, 'admin_home.html', context)






def add_restaurant(request):

    if request.method == "POST":
        print("POST HIT")

        name = request.POST.get("name")
        print("Name:", name)

        cuisine = request.POST.get("cuisine")
        rating = request.POST.get("rating")
        image_url = request.POST.get("image_url")
        image = request.FILES.get("image")

        # Convert rating safely
        rating_value = float(rating) if rating else 0

        Restaurant.objects.create(
            name=name,
            cuisine=cuisine,
            rating=rating_value,
            image=image if image else None,
            image_url=image_url if image_url else None
        )

        print("SAVED")

        restaurant = Restaurant.objects.all()
        return redirect('show_restaurant')
  
        # 👆 Use namespace if you have app_name = "delivery"

    return render(request, "add_restaurant.html")


def update_restaurant(request, id):
    restaurant = get_object_or_404(Restaurant, id=id)

    if request.method == "POST":
        restaurant.name = request.POST.get("name")
        restaurant.cuisine = request.POST.get("cuisine")
        restaurant.rating = request.POST.get("rating")

        # Image upload from device
        if request.FILES.get("image"):
            restaurant.image = request.FILES.get("image")

        # Image URL update
        image_url = request.POST.get("image_url")
        if image_url:
            restaurant.image_url = image_url

        restaurant.save()
        return redirect("show_restaurant")

    return render(request, "update_restaurant.html", {
        "restaurant": restaurant
    })


def view_restaurant(request, id):
    restaurant = get_object_or_404(Restaurant, id=id)
    menu_items = MenuItem.objects.filter(restaurant=restaurant)

    if request.method == "POST":
        name = request.POST.get("name")
        description = request.POST.get("description")
        price = request.POST.get("price")
        image = request.FILES.get("image")
        image_url = request.POST.get("image_url")

        MenuItem.objects.create(
            restaurant=restaurant,
            name=name,
            description=description,
            price=price,
            image=image,
            image_url=image_url,
        )

        return redirect('view_restaurant', id=id)

    return render(request, "view.html", {
        "restaurant": restaurant,
        "menu_items": menu_items
    })

def delete_menu_item(request, id):
    item = get_object_or_404(MenuItem, id=id)
    restaurant_id = item.restaurant.id
    item.delete()
    return redirect('view_restaurant', id=restaurant_id)


def update_menu_item(request, id):
    item = get_object_or_404(MenuItem, id=id)

    if request.method == "POST":
        item.name = request.POST.get("name")
        item.description = request.POST.get("description")
        item.price = request.POST.get("price")

        image = request.FILES.get("image")
        image_url = request.POST.get("image_url")

        if image:
            item.image = image

        if image_url:
            item.image_url = image_url

        item.save()

        return redirect('view_restaurant', id=item.restaurant.id)

    return render(request, "update_menu_item.html", {"item": item})


def customer_home(request):
    from .models import Restaurant
    restaurants = Restaurant.objects.all()
    

    return render(request, 'customer_home.html', {
        'restaurants': restaurants
    })

def customer_menu(request, id):
    from .models import Restaurant, MenuItem

    restaurant = Restaurant.objects.get(id=id)
    menu_items = MenuItem.objects.filter(restaurant=restaurant)

    return render(request, 'view_item.html', {
        'restaurant': restaurant,
        'menu_items': menu_items
    })





def view_items(request, id):
    from .models import Restaurant, MenuItem

    restaurant = Restaurant.objects.get(id=id)
    items = MenuItem.objects.filter(restaurant=restaurant)

    return render(request, 'view_items.html', {
        'restaurant': restaurant,
        'items': items
    })



def add_to_cart(request, id):
    item = get_object_or_404(MenuItem, id=id)

    username = request.session.get('username')
    if not username:
        return redirect('signin')

    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})

    if str(id) in cart:
        cart[str(id)]['quantity'] += 1
    else:
        cart[str(id)] = {
            'name': item.name,
            'price': float(item.price),
            'quantity': 1,
            'restaurant_id': item.restaurant.id   # ✅ ADD THIS LINE
        }

    request.session[cart_key] = cart
    request.session.modified = True

    return redirect(request.META.get('HTTP_REFERER'))


def cart_view(request):
    username = request.session.get('username')
    if not username:
        return redirect('signin')

    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})

    total_price = 0
    for item in cart.values():
        item['subtotal'] = item['price'] * item['quantity']
        total_price += item['subtotal']

    return render(request, 'cart.html', {
        'cart': cart,
        'total_price': total_price
    })

def remove_from_cart(request, id):
    username = request.session.get('username')
    cart_key = f"cart_{username}"

    cart = request.session.get(cart_key, {})

    if str(id) in cart:
        del cart[str(id)]

    request.session[cart_key] = cart
    request.session.modified = True

    return redirect('cart_view')


def increase_qty(request, id):
    username = request.session.get('username')
    cart_key = f"cart_{username}"

    cart = request.session.get(cart_key, {})

    if str(id) in cart:
        cart[str(id)]['quantity'] += 1

    request.session[cart_key] = cart
    request.session.modified = True

    return redirect('cart_view')


def decrease_qty(request, id):
    username = request.session.get('username')
    cart_key = f"cart_{username}"

    cart = request.session.get(cart_key, {})

    if str(id) in cart:
        cart[str(id)]['quantity'] -= 1
        if cart[str(id)]['quantity'] <= 0:
            del cart[str(id)]

    request.session[cart_key] = cart
    request.session.modified = True

    return redirect('cart_view')


def checkout_page(request):
    username = request.session.get('username')
    if not username:
        return redirect('signin')

    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})

    if not cart:
        return redirect('cart_view')

    total_price = 0
    for item in cart.values():
        item['subtotal'] = item['price'] * item['quantity']
        total_price += item['subtotal']

    return render(request, "checkout.html", {
        "cart": cart,
        "total_price": total_price
    })



def payment_page(request):
    username = request.session.get('username')
    if not username:
        return redirect('signin')

    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})

    if not cart:
        return redirect('cart_view')

    total_price = 0
    for item in cart.values():
        total_price += item['price'] * item['quantity']

    amount = int(total_price * 100)

    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )

    payment = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": "1"
    })

    return render(request, "payment.html", {
        "payment": payment,
        "razorpay_key": settings.RAZORPAY_KEY_ID,
        "total_price": total_price
    })


def confirm_payment(request):

    payment_id = request.GET.get('payment_id')

    username = request.session.get('username')
    if not username:
        return redirect('signin')

    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})

    if not cart:
        return redirect('customer_home')

    total_price = 0
    for item in cart.values():
        total_price += item['price'] * item['quantity']

    customer_obj = Customer.objects.get(username=username)

    # Get restaurant from first item
    first_menu_id = list(cart.keys())[0]
    menu_item = MenuItem.objects.get(id=first_menu_id)
    restaurant_obj = menu_item.restaurant

    # Create order
    order = Order.objects.create(
        customer=customer_obj,
        restaurant=restaurant_obj,
        total_price=total_price
    )

    # Clear cart
    request.session[cart_key] = {}
    request.session.modified = True

    return render(request, "payment_success.html", {
        "order": order,
        "customer": customer_obj
    })

from .models import Order, Customer

def payment_success(request):
    username = request.session.get("username")

    if not username:
        return redirect("signin")

    customer = Customer.objects.get(username=username)

    # Get latest order (you can adjust logic later)
    order = Order.objects.filter(customer=customer).last()

    return render(request, "payment_success.html", {
        "customer": customer,
        "order": order
    })

import razorpay
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def verify_payment(request):
    if request.method == "POST":
        data = json.loads(request.body)

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        params_dict = {
            'razorpay_order_id': data['order_id'],
            'razorpay_payment_id': data['payment_id'],
            'razorpay_signature': data['signature']
        }

        try:
            client.utility.verify_payment_signature(params_dict)

            # ✅ Mark order as paid in DB here

            return JsonResponse({"status": "success"})
        except:
            return JsonResponse({"status": "failed"})


def _json_body(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return {}


def _image_url(request, obj):
    if obj.image:
        return request.build_absolute_uri(obj.image.url)
    return obj.image_url or ""


def _restaurant_data(request, restaurant):
    return {
        "id": restaurant.id,
        "name": restaurant.name,
        "cuisine": restaurant.cuisine,
        "rating": restaurant.rating,
        "image": _image_url(request, restaurant),
    }


def _menu_item_data(request, item):
    return {
        "id": item.id,
        "restaurant": item.restaurant_id,
        "name": item.name,
        "description": item.description or "",
        "price": item.price,
        "image": _image_url(request, item),
    }


def _current_user(request):
    if request.session.get("admin"):
        return {"username": request.session["admin"], "role": "admin"}
    if request.session.get("username"):
        return {"username": request.session["username"], "role": "customer"}
    return None


def _cart_payload(request):
    username = request.session.get("username")
    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {}) if username else {}
    items = []
    total = 0

    for item_id, item in cart.items():
        subtotal = float(item["price"]) * int(item["quantity"])
        total += subtotal
        items.append({
            "id": item_id,
            "name": item["name"],
            "price": float(item["price"]),
            "quantity": int(item["quantity"]),
            "restaurant_id": item.get("restaurant_id"),
            "subtotal": subtotal,
        })

    return {"items": items, "total_price": total}


@csrf_exempt
def api_signin(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    data = _json_body(request)
    username = data.get("username", "").strip()
    password = data.get("password", "")

    if username == "admin":
        request.session["admin"] = username
        request.session.pop("username", None)
        return JsonResponse({"user": {"username": username, "role": "admin"}})

    user = Customer.objects.filter(username=username, password=password).first()
    if not user:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

    request.session["username"] = user.username
    request.session.pop("admin", None)
    return JsonResponse({"user": {"username": user.username, "role": "customer"}})


@csrf_exempt
def api_signup(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    data = _json_body(request)
    required = ["username", "email", "password", "mobile", "address"]
    if any(not data.get(field) for field in required):
        return JsonResponse({"error": "All fields are required"}, status=400)

    if Customer.objects.filter(username=data["username"], password=data["password"]).exists():
        return JsonResponse({"error": "Account already exists"}, status=400)

    Customer.objects.create(
        username=data["username"],
        email=data["email"],
        password=data["password"],
        mobile=data["mobile"],
        address=data["address"],
    )
    return JsonResponse({"message": "Account created"})


@csrf_exempt
def api_signout(request):
    request.session.flush()
    return JsonResponse({"message": "Signed out"})


def api_me(request):
    return JsonResponse({"user": _current_user(request)})


def api_dashboard(request):
    today = timezone.now().date()
    return JsonResponse({
        "total_users": Customer.objects.count(),
        "active_users": Customer.objects.count(),
        "total_restaurants": Restaurant.objects.count(),
        "total_orders": Order.objects.count(),
        "total_revenue": Order.objects.aggregate(total=Sum("total_price"))["total"] or 0,
        "todays_revenue": Order.objects.filter(created_at__date=today).aggregate(total=Sum("total_price"))["total"] or 0,
    })


@csrf_exempt
def api_restaurants(request):
    if request.method == "GET":
        restaurants = Restaurant.objects.all().order_by("name")
        return JsonResponse({"restaurants": [_restaurant_data(request, restaurant) for restaurant in restaurants]})

    if request.method == "POST":
        data = request.POST or _json_body(request)
        restaurant = Restaurant.objects.create(
            name=data.get("name", ""),
            cuisine=data.get("cuisine", ""),
            rating=float(data.get("rating") or 0),
            image=request.FILES.get("image"),
            image_url=data.get("image_url") or None,
        )
        return JsonResponse({"restaurant": _restaurant_data(request, restaurant)}, status=201)

    return JsonResponse({"error": "Unsupported method"}, status=405)


@csrf_exempt
def api_restaurant_detail(request, id):
    restaurant = get_object_or_404(Restaurant, id=id)

    if request.method == "GET":
        return JsonResponse({"restaurant": _restaurant_data(request, restaurant)})

    if request.method == "DELETE":
        restaurant.delete()
        return JsonResponse({"message": "Restaurant deleted"})

    if request.method == "POST":
        data = request.POST or _json_body(request)
        restaurant.name = data.get("name", restaurant.name)
        restaurant.cuisine = data.get("cuisine", restaurant.cuisine)
        restaurant.rating = float(data.get("rating") or restaurant.rating)
        if request.FILES.get("image"):
            restaurant.image = request.FILES["image"]
        if data.get("image_url"):
            restaurant.image_url = data["image_url"]
        restaurant.save()
        return JsonResponse({"restaurant": _restaurant_data(request, restaurant)})

    return JsonResponse({"error": "Unsupported method"}, status=405)


@csrf_exempt
def api_restaurant_menu(request, id):
    restaurant = get_object_or_404(Restaurant, id=id)

    if request.method == "GET":
        items = MenuItem.objects.filter(restaurant=restaurant).order_by("name")
        return JsonResponse({
            "restaurant": _restaurant_data(request, restaurant),
            "items": [_menu_item_data(request, item) for item in items],
        })

    if request.method == "POST":
        data = request.POST or _json_body(request)
        item = MenuItem.objects.create(
            restaurant=restaurant,
            name=data.get("name", ""),
            description=data.get("description", ""),
            price=float(data.get("price") or 0),
            image=request.FILES.get("image"),
            image_url=data.get("image_url") or None,
        )
        return JsonResponse({"item": _menu_item_data(request, item)}, status=201)

    return JsonResponse({"error": "Unsupported method"}, status=405)


@csrf_exempt
def api_menu_item_detail(request, id):
    item = get_object_or_404(MenuItem, id=id)

    if request.method == "DELETE":
        item.delete()
        return JsonResponse({"message": "Menu item deleted"})

    if request.method == "POST":
        data = request.POST or _json_body(request)
        item.name = data.get("name", item.name)
        item.description = data.get("description", item.description)
        item.price = float(data.get("price") or item.price)
        if request.FILES.get("image"):
            item.image = request.FILES["image"]
        if data.get("image_url"):
            item.image_url = data["image_url"]
        item.save()
        return JsonResponse({"item": _menu_item_data(request, item)})

    return JsonResponse({"error": "Unsupported method"}, status=405)


def api_cart(request):
    if not request.session.get("username"):
        return JsonResponse({"error": "Please sign in as customer"}, status=401)
    return JsonResponse({"cart": _cart_payload(request)})


@csrf_exempt
def api_cart_add(request, id):
    item = get_object_or_404(MenuItem, id=id)
    username = request.session.get("username")
    if not username:
        return JsonResponse({"error": "Please sign in as customer"}, status=401)

    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})
    cart.setdefault(str(id), {
        "name": item.name,
        "price": float(item.price),
        "quantity": 0,
        "restaurant_id": item.restaurant.id,
    })
    cart[str(id)]["quantity"] += 1
    request.session[cart_key] = cart
    request.session.modified = True
    return JsonResponse({"cart": _cart_payload(request)})


@csrf_exempt
def api_cart_remove(request, id):
    username = request.session.get("username")
    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})
    cart.pop(str(id), None)
    request.session[cart_key] = cart
    request.session.modified = True
    return JsonResponse({"cart": _cart_payload(request)})


@csrf_exempt
def api_cart_increase(request, id):
    username = request.session.get("username")
    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})
    if str(id) in cart:
        cart[str(id)]["quantity"] += 1
    request.session[cart_key] = cart
    request.session.modified = True
    return JsonResponse({"cart": _cart_payload(request)})


@csrf_exempt
def api_cart_decrease(request, id):
    username = request.session.get("username")
    cart_key = f"cart_{username}"
    cart = request.session.get(cart_key, {})
    if str(id) in cart:
        cart[str(id)]["quantity"] -= 1
        if cart[str(id)]["quantity"] <= 0:
            cart.pop(str(id), None)
    request.session[cart_key] = cart
    request.session.modified = True
    return JsonResponse({"cart": _cart_payload(request)})


@csrf_exempt
def api_checkout(request):
    username = request.session.get("username")
    if not username:
        return JsonResponse({"error": "Please sign in as customer"}, status=401)

    cart = _cart_payload(request)
    if not cart["items"]:
        return JsonResponse({"error": "Cart is empty"}, status=400)

    customer = Customer.objects.get(username=username)
    restaurant = Restaurant.objects.get(id=cart["items"][0]["restaurant_id"])
    order = Order.objects.create(customer=customer, restaurant=restaurant, total_price=cart["total_price"])
    request.session[f"cart_{username}"] = {}
    request.session.modified = True

    return JsonResponse({
        "order": {
            "id": order.id,
            "customer": customer.username,
            "restaurant": restaurant.name,
            "total_price": float(order.total_price),
            "created_at": order.created_at.isoformat(),
        }
    }, status=201)


