from django.conf.urls import url

from . import views

urlpatterns = [
	# Dashboard URLs
	url(r'^$', views.index, name='index'),
	url(r'^dashboard', views.dashboard, name='dashboard'),
	url(r'^create_party', views.create_party),
	url(r'^party/(?P<party_slug>[\w-]+)/$', views.edit_party),
	url(r'^create_character', views.create_character),

	# User URLs
	url(r'^login/', views.login_view, name='login'),
	url(r'^logout/', views.logout_view, name='logout'),
	url(r'^register/', views.register, name='register')
]