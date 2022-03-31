from django.urls import path
from chess import views


urlpatterns = [
    path('', views.home, name='home'),
    path('about', views.about, name='about'),
    path('pieces/register', views.register_piece, name='register_piece'),
    path('pieces/delete', views.delete_piece, name='delete_piece'),
    path('pieces', views.list_pieces, name='list_pieces')
    ]
