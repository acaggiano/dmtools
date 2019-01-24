# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2018-08-02 15:56
from __future__ import unicode_literals

from django.db import migrations, models
import dmdashboard.models


class Migration(migrations.Migration):

    dependencies = [
        ('dmdashboard', '0011_auto_20170621_1414'),
    ]

    operations = [
        migrations.AlterField(
            model_name='character',
            name='name',
            field=models.TextField(validators=[dmdashboard.models.invalidate_blank]),
        ),
        migrations.AlterField(
            model_name='party',
            name='name',
            field=models.TextField(validators=[dmdashboard.models.invalidate_blank]),
        ),
    ]