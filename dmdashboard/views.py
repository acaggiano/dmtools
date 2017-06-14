from django.shortcuts import render
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect

# Create your views here.
def index(request):
	""" Homepage for DM Tools """
	if request.user.is_authenticated():
		pass
	else:
		return render(request, 'dmdashboard/index.html')

def login(request):
	if request.method != 'POST':
		# No data submitted, serve login template
		return render(request, 'dmdashboard/login.html')
	else:
		email = request.POST['email']
		password = request.POST['secret']

		user = authenticate(request, email=email, password=password)
		if user is not None:
			auth_login(request, user)
			return HttpResponse('YUP YUP YUP')

		else:
			return HttpResponse('NOPE NOPE NOPE')
