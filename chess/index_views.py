from django.shortcuts import render
from django.template.loader import render_to_string
from django.http import HttpResponse
from chess.models import Pieces, MovesHistory
import json


class IndexView:
    def home(self, request):
        colors = Pieces.objects.values('color').distinct()
        names = Pieces.objects.values('name').distinct()

        data = {
            'title': "Home",
            'colors': colors,
            'names': names,
        }

        return render(request, 'home.html', data)

    def about(self, request):
        data = {'title': "About"}

        return render(request, 'about.html', data)

    def list_history(self, request):
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
