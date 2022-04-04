from django.db import models


class Pieces(models.Model):
    name = models.CharField(max_length=24)
    color = models.CharField(max_length=16)

    def __str__(self):
        return self.name


class MovesHistory(models.Model):
    field = models.CharField(max_length=3)
    coordinates = models.TextField()
    piece = models.ForeignKey(
        Pieces,
        verbose_name="Piece",
        on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.field
