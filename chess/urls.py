from django.urls import path
from chess.index_views import IndexView
from chess.pieces_views import PiecesView


urlpatterns = [
    path('', IndexView().home, name='home'),
    path('about', IndexView().about, name='about'),
    path('pieces/register', PiecesView().register, name='register_piece'),
    path('pieces/save', PiecesView().save, name='save_piece'),
    path('pieces/save/<int:id>', PiecesView().save, name='save_piece'),
    path('pieces/delete', PiecesView().delete, name='delete_piece'),
    path('pieces/delete/<int:id>', PiecesView().delete, name='delete_piece'),
    path('pieces', PiecesView().list, name='list_pieces'),
    path('pieces/<int:id>', PiecesView().list, name='list_pieces'),
    path('pieces/get_id', PiecesView().get_id, name='get_piece_id'),
    path('pieces/get_knight_moves',
         PiecesView().get_knight_moves, name='get_knight_moves'),
    path('history', IndexView().list_history, name='list_history')
]
