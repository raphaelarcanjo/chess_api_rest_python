from django.shortcuts import render
from django.template.loader import render_to_string
from chess.models import Pieces, MovesHistory
from django.http import HttpResponse, JsonResponse
import json


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


def list_moves(coordinates, alfabet):
    moves = []
    row, col = coordinates
    col = alfabet.index(col)
    moves.append([(row - 1), (alfabet[col - 2])])
    moves.append([(row + 1), (alfabet[col - 2])])
    moves.append([(row - 1), (alfabet[col + 2])])
    moves.append([(row - 2), (alfabet[col - 1])])
    moves.append([(row - 2), (alfabet[col + 1])])
    moves.append([(row + 2), (alfabet[col - 1])])
    moves.append([(row + 2), (alfabet[col + 1])])
    moves.append([(row + 1), (alfabet[col + 2])])

    return moves


def save_history(field, coordinates, piece):
    history = MovesHistory()
    history.field = field
    history.coordinates = coordinates
    history.piece = piece
    history.save()

    return history.id


def list_history(request):
    history = MovesHistory.objects.values().order_by('-id')

    for item in history:
        parsed_json = json.loads(item['coordinates'])
        fixed_list = []
        for coord in parsed_json:
            fixed_item = [str(coord[0]), coord[1]]
            fixed_list.append(''.join(fixed_item))
        item['coordinates'] = ', '.join(fixed_list)

    data = {'history': history}
    html = render_to_string('history/list.html', data)

    return HttpResponse(html)


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
            piece.name = request.POST['name'].lower()
            piece.color = request.POST['color'].lower()
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

    def get_id(request):
        try:
            name = request.GET['name'].lower()
            color = request.GET['color'].lower()
            piece = Pieces.objects.filter(name=name, color=color).values()
            piece = list(piece)[0]
            error = ''
        except IndexError:
            error = "Piece not found!"
            piece = []
        return JsonResponse({
            'error': error,
            'piece': piece
            })

    def get_knight_moves(request):
        alfabet = "abcdefghijklmnopqrstuvwxyz"
        moves = []

        try:
            row, col = [i for i in request.GET['coordinates']]
            row = int(row)
        except ValueError:
            return JsonResponse({
                'error': 'Wrong coordinates format or empty coordinates',
                'moves': moves
                })
        try:
            piece = Pieces.objects.get(id=request.GET['piece_id'])
        except ValueError:
            return JsonResponse({
                'error': 'Empty piece ID', 'moves': moves
                })
        if piece and piece.name == 'knight':
            error = ''
            moves = list_moves(
                [row, col],
                alfabet)

            save_history(
                ''.join([str(row), col]),
                json.dumps(moves),
                piece)
        else:
            error = 'Piece not found or this piece is not a "knight"'
            moves = []
        return JsonResponse({
            'error': error,
            'moves': moves
            })
