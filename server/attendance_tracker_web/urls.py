from django.conf.urls import patterns, include, url
from django.contrib import admin

from django.contrib.auth.views import login, logout
from django.contrib.auth.decorators import user_passes_test

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

login_forbidden = user_passes_test(lambda u: u.is_anonymous(), login_url='/')

urlpatterns = patterns('',
    url(r'^login$', login_forbidden(login), name='login'),
    url(r'^logout$', logout, {'next_page': '/'}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('attendance_stats.urls')),
) + staticfiles_urlpatterns()
