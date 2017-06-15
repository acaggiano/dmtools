from django.conf.urls import url

from . import views

urlpatterns = [
	# Dashboard URLs
	url('^$', views.index, name='index'),
	url('^dashboard', views.dashboard, name='dashboard'),

	# User URLs
	url('^login/', views.login_view, name='login'),
	url('^logout/', views.logout_view, name='logout'),
	url('^register/', views.register, name='register')
]