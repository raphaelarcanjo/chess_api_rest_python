from django.db import models


class Pieces(models.Model):
    name = models.CharField(max_length=24)
    color = models.CharField(max_length=16)
