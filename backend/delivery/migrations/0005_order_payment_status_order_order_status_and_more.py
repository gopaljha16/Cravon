from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("delivery", "0004_menuitem_description_menuitem_image_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="order_status",
            field=models.CharField(default="placed", max_length=20),
        ),
        migrations.AddField(
            model_name="order",
            name="payment_status",
            field=models.CharField(default="pending", max_length=20),
        ),
        migrations.AddField(
            model_name="order",
            name="razorpay_order_id",
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
        migrations.AddField(
            model_name="order",
            name="razorpay_payment_id",
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]
