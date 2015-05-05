from django.conf.urls import patterns, include, url
from attendance_stats import views

urlpatterns = patterns('',
    # main redirector
    url(r'^$', views.index, name='index'),

    # endpoint for mobile
    url(r'^sync$', views.sync, name='sync'),

    # endpoint for getting semesters
    url(r'^semesters/json$', views.semesters, name='semesters'),
)