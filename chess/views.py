from django.shortcuts import render
from django.template.loader import render_to_string
from chess.models import Pieces
from django.http import HttpResponse, JsonResponse


def home(request):
    data = {'title': "Home"}

    return render(request, 'home.html', data)


def about(request):
    data = {'title': "About"}

    return render(request, 'about.html', data)


def list_pieces(request):
    pieces = Pieces.objects.all()
    data = {'pieces': pieces}
    html = render_to_string('pieces/list.html', data)

    return HttpResponse(html)


def register_piece(request):
    data = {'title': "Pieces"}

    if request.method == 'POST':
        piece = Pieces()
        piece.name = request.POST['name']
        piece.color = request.POST['color']
        piece.save()
        status = True if piece.id else False

        return JsonResponse({'status': status})

    return render(request, 'pieces/register.html', data)


def delete_piece(request):
    try:
        Pieces.objects.get(id=request.POST['id']).delete()

        return JsonResponse({'status': True})
    except Exception:
        return JsonResponse({'status': False})
