import os
from pathlib import Path
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve

FRONTEND_DIST = settings.BASE_DIR.parent / 'frontend' / 'dist'
ASSETS_DIR = FRONTEND_DIST / 'assets'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

if os.path.exists(ASSETS_DIR):
    urlpatterns += [
        re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': ASSETS_DIR}),
    ]

if os.path.exists(FRONTEND_DIST / 'index.html'):
    urlpatterns += [
        re_path(r'^(?!api|admin|media|assets).*$', TemplateView.as_view(template_name='index.html')),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
