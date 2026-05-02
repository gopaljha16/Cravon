import os
import sys
from django.core.wsgi import get_wsgi_application

# Increase recursion depth for Djongo/sqlparse compatibility
sys.setrecursionlimit(5000)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cravon.settings")

application = get_wsgi_application()
