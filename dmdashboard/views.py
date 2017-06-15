from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect

from django.contrib.auth import get_user_model, authenticate, login, logout, password_validation
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email

from django.core.exceptions import ValidationError

# Create your views here.
def index(request):
	""" Homepage for DM Tools """
	if request.user.is_authenticated():
		return HttpResponseRedirect(reverse('dashboard'))
	else:
		return render(request, 'dmdashboard/index.html')

def dashboard(request):
	return render(request, 'dmdashboard/dashboard.html')

def login_view(request):
	if request.method != 'POST':
		# No data submitted, serve login template
		return render(request, 'dmdashboard/login.html')
	else:
		email = request.POST['email']
		password = request.POST['secret']

		user = authenticate(request, email=email, password=password)
		if user is not None:
			login(request, user)
			return HttpResponseRedirect(reverse('index'))

		else:
			return HttpResponse('Could Not Log In, Please check your email and password and try again')

def logout_view(request):
	logout(request)

	return HttpResponseRedirect(reverse('index'))

def register(request):
	if request.method != 'POST':
		context = {'requirements': password_validation.password_validators_help_text_html }
		return render(request, 'dmdashboard/register.html', context)
	else:
		email = request.POST['email']
		password = request.POST['secret']
		password_check = request.POST['secretCheck']

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
				return HttpResponse('Password does not meet requirements!')

		if validate_email and valid_password:
			User = get_user_model()
			try:
				user = User.objects.create_user(email, password)
				login(request, user)
				return HttpResponseRedirect(reverse('index'))
			except IntegrityError:
				return HttpResponse('This email is already tied to an account')

			




