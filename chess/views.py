from django.shortcuts import render
from django.template.loader import render_to_string
from chess.models import Pieces
from django.http import HttpResponse, JsonResponse


class IndexView:
    def home(request):
        colors = Pieces.objects.values('color').distinct()
        names = Pieces.objects.values('name').distinct()

        data = {
            'title': "Home",
            'colors': colors,
            'names': names,
            }

        return render(request, 'home.html', data)

    def about(request):
        data = {'title': "About"}

        return render(request, 'about.html', data)


class PiecesView:
    def list(request, id=None):
        pieces = [Pieces.objects.get(id=id)] if id else Pieces.objects.all()
        data = {'pieces': pieces}
        html = render_to_string('pieces/list.html', data)

        return HttpResponse(html)

    def register(request):
        data = {'title': "Pieces"}

        return render(request, 'pieces/register.html', data)

    def save(request, id=None):
        if request.method == 'POST':
            piece = Pieces.objects.get(id=id) if id else Pieces()
            piece.name = request.POST['name']
            piece.color = request.POST['color']
            piece.save()
            status = True if piece.id else False

            return JsonResponse({'status': status})

    def delete(request, id=None):
        try:
            if id:
                Pieces.objects.get(id=id).delete()
            else:
                Pieces.objects.all().delete()

            return JsonResponse({'status': True})
        except Exception:
            return JsonResponse({'status': False})
