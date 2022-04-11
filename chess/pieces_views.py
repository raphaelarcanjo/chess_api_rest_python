from django.shortcuts import render
from django.template.loader import render_to_string
from chess.models import Pieces, MovesHistory
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json


class PiecesView:
    @csrf_exempt
    def list(self, request, id=None):
        pieces = [Pieces.objects.get(id=id)] if id else Pieces.objects.all()
        data = {'pieces': pieces}
        html = render_to_string('pieces/list.html', data)

        return HttpResponse(html)

    @csrf_exempt
    def register(self, request):
        data = {'title': "Pieces"}

        return render(request, 'pieces/register.html', data)

    @csrf_exempt
    def save(self, request, id=None):
        if request.method == 'POST':
            piece = Pieces.objects.get(id=id) if id else Pieces()
            piece.name = request.POST['name'].lower()
            piece.color = request.POST['color'].lower()
            piece.save()
            status = True if piece.id else False

            return JsonResponse({'status': status})

    @csrf_exempt
    def delete(self, request, id=None):
        try:
            if id:
                Pieces.objects.get(id=id).delete()
            else:
                Pieces.objects.all().delete()

            return JsonResponse({'status': True})
        except Exception:
            return JsonResponse({'status': False})

    @csrf_exempt
    def get_id(self, request):
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

    @csrf_exempt
    def get_knight_moves(self, request):
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
            moves = self.list_moves(
                [row, col],
                alfabet)

            self.save_history(
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

    def list_moves(self, coordinates, alfabet):
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

    def save_history(self, field, coordinates, piece):
        history = MovesHistory()
        history.field = field
        history.coordinates = coordinates
        history.piece = piece
        history.save()

        return history.id
