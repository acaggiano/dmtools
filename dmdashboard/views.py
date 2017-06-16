from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect

from .models import Party, Character

from django.contrib.auth import get_user_model, authenticate, login, logout, password_validation
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
import json

from django.core.exceptions import ValidationError
from django.db import IntegrityError

# Create your views here.
def index(request):
	""" Homepage for DM Tools """
	if request.user.is_authenticated():
		return HttpResponseRedirect(reverse('dashboard'))
	else:
		return render(request, 'dmdashboard/index.html')

@login_required
def dashboard(request):
	user = request.user

	parties = Party.objects.filter(dm=user)

	characters = Character.objects.filter(dm=user)

	context = { 'user': user, 'parties': parties, 'characters': characters,
	}
	return render(request, 'dmdashboard/dashboard.html', context)

@login_required
def create_party(request):
	user = request.user
	party_name = request.POST['party_name']

	new_party = Party(dm=user, name=party_name)
	new_party.save()

	return HttpResponse('New Party Created')

@login_required
def create_character(request):
	user = request.user
	character_name = request.POST['character_name']

	new_character = Character(dm=user, name=character_name)
	new_character.save()

	return HttpResponse('New Character Created')

def login_view(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect(reverse('dashboard'))
	else:
		if request.method != 'POST':
			# No data submitted, serve login template
			return render(request, 'dmdashboard/login.html')
		else:
			email = request.POST['email']
			password = request.POST['secret']

			if not email or not password:
				response = HttpResponse('Please fill out all fields!')
				response.status_code = 401
				return response

			user = authenticate(request, email=email, password=password)
			if user is not None:
				login(request, user)
				response = {'status': 202, 'url':'/dashboard'}
				return HttpResponse(json.dumps(response), content_type='application/json')
			else:
				response = HttpResponse('Could Not Log In, Please check your email and password and try again')
				response.status_code = 401
				return response

def logout_view(request):
	logout(request)

	return HttpResponseRedirect(reverse('index'))

def register(request):
	if request.user.is_authenticated():
		return HttpResponseRedirect(reverse('dashboard'))
	else:
		if request.method != 'POST':
			context = {'requirements': password_validation.password_validators_help_text_html,}
			
			
			return render(request, 'dmdashboard/login.html', context)
		else:
			email = request.POST['email']
			password = request.POST['secret']
			password_check = request.POST['secretCheck']

			if not email or not password or not password_check:
				response = HttpResponse('Please fill out all fields!')
				response.status_code = 401
				return response

			try:
				validate_email(email)
				valid_email = True
			except validate_email.ValidationError:
				return HttpResponse('Please enter a valid email!')

			if password != password_check:
				return HttpResponse('Passwords do not match, ya dingus')
			else: 
				try:
					password_validation.validate_password(password)
					valid_password = True
				except ValidationError:
					response = HttpResponse('Password does not meet requirements!')
					response.status_code = 401
					return response

			if validate_email and valid_password:
				User = get_user_model()
				try:
					user = User.objects.create_user(email, password)
					login(request, user)
					response = {'status': 202, 'url':'/dashboard'}
					return HttpResponse(json.dumps(response), content_type='application/json')
				except IntegrityError:
					response = HttpResponse('This email is already tied to an account')
					response.status_code = 401
					return response

			




