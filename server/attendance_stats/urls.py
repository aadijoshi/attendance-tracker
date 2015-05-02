from django.conf.urls import patterns, include, url
from attendance_stats import views

urlpatterns = patterns('',
    # main redirector
    # url(r'^$', views.index, name='index'),

    url(r'^sync$', views.sync, name='sync'),
)