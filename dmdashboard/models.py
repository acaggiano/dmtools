from django.conf import settings
from django.db import models

# Create your models here.
class Party(models.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	name = models.CharField(max_length=100)


class Character(model.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	party = models.ForeignKey(Party)
	name = CharField(max_length=100)
	race = CharField(max_length=50)
	char_class = CharField(max_length=50)
	background = CharField(max_length=50)
	alignment = CharField(max_length=25)
	armor_class = PositiveSmallIntegerField()
	passive_perception = PositiveSmallIntegerField()
	spell_dc = PositiveSmallIntegerField()
