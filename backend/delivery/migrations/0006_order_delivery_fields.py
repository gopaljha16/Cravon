from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("delivery", "0005_order_payment_status_order_order_status_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="delivery_address",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="order",
            name="delivery_fee",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="order",
            name="delivery_instructions",
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name="order",
            name="delivery_phone",
            field=models.CharField(blank=True, max_length=15),
        ),
        migrations.AddField(
            model_name="order",
            name="subtotal",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
        migrations.AddField(
            model_name="order",
            name="tax_amount",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
