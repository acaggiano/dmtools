from django.conf import settings
from django.db import models
from django.utils.text import slugify
from django.core.exceptions import ValidationError

def invalidate_blank(value):
	if value == "":
		raise ValidationError('Value cannot be blank')

# Create your models here.
class Party(models.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	name = models.TextField()
	slug = models.TextField(blank=True)
	active = models.BooleanField(default=False)

	class Meta:
		verbose_name_plural = "Parties"
		unique_together = ('dm', 'slug')

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		invalidate_blank(self.name)
			
		self.slug = slugify(self.name)
		super(Party, self).save()

		if(self.active == True):
			others = Party.objects.filter(dm=self.dm).exclude(pk=self.pk)

			for party in others:

				party.active = False
				party.save()


class Character(models.Model):
	dm = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	party = models.ForeignKey(Party, null=True, blank=True)
	name = models.TextField(validators=[invalidate_blank])
	slug = models.TextField(blank=True)
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

	class Meta:
		unique_together = ('dm', 'slug')

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		invalidate_blank(self.name)
		self.slug = slugify(self.name)
		super(Character, self).save()
