from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse



from django.contrib.auth import get_user_model, authenticate, login, logout, password_validation
from django.contrib.auth.decorators import login_required
from django.core.validators import validate_email
import json
from django.core import serializers

from django.core.exceptions import ValidationError
from django.db import IntegrityError

from .models import Party, Character

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
	try:
		active_party = Party.objects.get(active=True)
	except Party.DoesNotExist:
		active_party = False


	characters = Character.objects.filter(dm=user)

	context = { 
		'user': user,
		'active': active_party,
		'parties': parties, 
		'characters': characters,
	}
	return render(request, 'dmdashboard/dashboard.html', context)

@login_required
def create_party(request):
	user = request.user
	party_name = request.POST['party_name']
	if request.POST.get('active') == 'true':
		party_active = True
	else:
		party_active = False
	characters = request.POST.getlist('characters[]')

	new_party = Party(dm=user, name=party_name, active=party_active)
	try:	
		new_party.save()

		for character_id in characters:
			char = Character.objects.get(pk=character_id)
			char.party = new_party
			char.save()

		return HttpResponse('New Party Created')
	except IntegrityError:
		response = HttpResponse(' already exists!')
		response.status_code = 400
		return response

@login_required
def edit_party(request, party_slug):
	user = request.user
	selected_party = Party.objects.get(dm=user, slug=party_slug)
	original_name = selected_party.name

	if request.method != 'POST':
		response = {}

		response['party_name'] = selected_party.name
		response['isActive'] = selected_party.active

		characters = list(Character.objects.filter(dm=user, party=selected_party).values_list('name', flat=True))

		response['characters'] = characters

		return JsonResponse(response)
	else:
		new_name = request.POST['party_name']
		if request.POST.get('active') == 'true':
			new_active = True
		else:
			new_active = False
		characters = request.POST.getlist('characters[]')

		selected_party.name = new_name
		selected_party.active = new_active


		try:
			selected_party.save()

			for character_id in characters:
				char = Character.objects.get(pk=character_id)
				char.party = selected_party
				char.save()

			return HttpResponse('Party Edited')
		except IntegrityError:
			data = {'message': 'Party Name is Taken!', 'original': original_name}
			response = JsonResponse(data)
			response.status_code = 400
			return response

@login_required
def create_character(request):
	user = request.user
	character_name = request.POST['character_name']
	race = request.POST['race']
	char_class = request.POST['char_class']
	background = request.POST['background']
	alignment = request.POST['alignment']
	armor_class = request.POST.get('armor_class', None)
	passive_perception = request.POST.get('passive_perception', None)
	spell_dc = request.POST.get('spell_dc', None)

	try:
		if armor_class:
			armor_class = int(armor_class)
		else:
			armor_class = None
	except ValueError:
		response = HttpResponse("Armor Class is Invalid!")
		response.status_code = 400
		return response

	try:
		if passive_perception:
			passive_perception = int(passive_perception)
		else:
			passive_perception = None
	except ValueError:
		response = HttpResponse("Passive Perception is Invalid!")
		response.status_code = 400
		return response

	try:
		if spell_dc:
			spell_dc = int(spell_dc)
		else:
			spell_dc = None
	except ValueError:
		response = HttpResponse("Spell Save DC is Invalid!")
		response.status_code = 400
		return response

	new_character = Character(dm=user, name=character_name, race=race, char_class=char_class, background=background, 
		alignment=alignment, armor_class=armor_class, passive_perception=passive_perception, spell_dc=spell_dc)

	try:	
		new_character.save()
		return HttpResponse('New Character Created')
	except IntegrityError:
		response = HttpResponse(' already exists!')
		response.status_code = 400
		return response

	return HttpResponse('UH OH')

@login_required
def edit_character(request, character_slug):
	user = request.user
	if request.method != 'POST':
		character_info = serializers.serialize('json', Character.objects.filter(dm=user, slug=character_slug))

		return JsonResponse(character_info, safe=False)
	else:
		selected_character = Character.objects.get(dm=user, slug=character_slug)
		original_name = selected_character.name

		new_name = request.POST['character_name']
		new_race = request.POST['race']
		new_char_class = request.POST['char_class']
		new_background = request.POST['background']
		new_alignment = request.POST['alignment']
		new_armor_class = request.POST.get('armor_class', None)
		new_passive_perception = request.POST.get('passive_perception', None)
		new_spell_dc = request.POST.get('spell_dc', None)

		try:
			if new_armor_class:
				new_armor_class = int(new_armor_class)
			else:
				new_armor_class = None
		except ValueError:
			response = HttpResponse("Armor Class is Invalid!")
			response.status_code = 400
			return response

		try:
			if new_passive_perception:
				new_passive_perception = int(new_passive_perception)
			else:
				new_passive_perception = None
		except ValueError:
			response = HttpResponse("Passive Perception is Invalid!")
			response.status_code = 400
			return response

		try:
			if new_spell_dc:
				new_spell_dc = int(new_spell_dc)
			else:
				new_spell_dc = None
		except ValueError:
			response = HttpResponse("Spell Save DC is Invalid!")
			response.status_code = 400
			return response

		selected_character.name = new_name
		selected_character.race = new_race
		selected_character.char_class = new_char_class
		selected_character.background = new_background
		selected_character.alignment = new_alignment
		selected_character.armor_class = new_armor_class
		selected_character.passive_perception = new_passive_perception
		selected_character.spell_dc = new_spell_dc

		try:
			selected_character.save()

			return HttpResponse("Character Saved")
		except IntegrityError:
			data = {'message': 'Character Name is Taken!', 'original': original_name}
			response = JsonResponse(data)
			response.status_code = 400
			return response



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
			
			
			return render(request, 'dmdashboard/register.html', context)
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

			




