"""
WSGI config for dmtools project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

sys.path.append('/var/www/dmtools.weodev.party/dmsite/')
sys.path.append('/var/www/dmtools.weodev.party/dmenv/lib/python3.6/sites-packages')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "dmtools.settings")

application = get_wsgi_application()
