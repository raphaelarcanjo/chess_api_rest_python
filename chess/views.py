from django.shortcuts import render


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
