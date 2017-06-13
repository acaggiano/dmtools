from django.conf import settings
from django.db import models

# Create your models here.
class Party(models.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	name = models.CharField(max_length=100)


class Character(model.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	party = models.ForeignKey(Party, null=True, blank=True)
	info = JSONField()
