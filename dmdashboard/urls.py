from django.conf.urls import url

from . import views

urlpatterns = [
	url('^$', views.index, name='index'),
	url('^login/', views.login, name='login'),
]