from django.shortcuts import render
from django.template.loader import render_to_string
from chess.models import Pieces
from django.http import JsonResponse
import json


def home(request):
    data = {
        'title': "Home"
        }

    return render(request, 'home.html', data)


def about(request):
    data = {
        'title': "About"
        }

    return render(request, 'about.html', data)


def list_pieces(request):
    pieces = Pieces.objects.all()
    data = {
        'pieces': pieces
        }

    return render_to_string('pieces/list.html', data)


def register_piece(request):
    data = {
        'title': "Pieces",
        }
    if request.method == 'POST':
        return render_to_string('pieces/list.html', data)
    return render(request, 'pieces/register.html', data)
