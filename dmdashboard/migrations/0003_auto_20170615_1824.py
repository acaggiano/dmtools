# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-06-15 18:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dmdashboard', '0002_auto_20170615_1640'),
    ]

    operations = [
        migrations.AlterField(
            model_name='party',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
