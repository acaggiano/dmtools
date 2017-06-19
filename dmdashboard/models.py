from django.conf import settings
from django.db import models

# Create your models here.
class Party(models.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	name = models.TextField()
	active = models.BooleanField(default=False)

	class Meta:
		verbose_name_plural = "Parties"
		unique_together = ('dm', 'name')

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		super(Party, self).save()

		if(self.active == True):
			others = Party.objects.exclude(pk=self.pk)

			for party in others:

				party.active = False
				party.save()


class Character(models.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	party = models.ForeignKey(Party, null=True, blank=True)
	name = models.TextField()
	race = models.TextField(null=True, blank=True)
	char_class = models.TextField(null=True, blank=True)
	background = models.TextField(null=True, blank=True)

	ALIGNMENT_CHOICES = (
		('LG', 'Lawful Good'),
		('NG', 'Neutral Good'),
		('CG', 'Chaotic Good'),
		('LN', 'Lawful Neutral'),
		('N', 'True Neutral'),
		('CN', 'Chaotic Neutral'),
		('LE', 'Lawful Evil'),
		('NE', 'Neutral Evil'),
		('CE', 'Chaotic Evil'),

	)
	alignment = models.TextField(choices=ALIGNMENT_CHOICES, null=True, blank=True)
	armor_class = models.PositiveSmallIntegerField(null=True, blank=True)
	passive_perception = models.PositiveSmallIntegerField(null=True, blank=True)
	spell_dc = models.PositiveSmallIntegerField(null=True, blank=True)
