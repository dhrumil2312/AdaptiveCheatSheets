from django.http import HttpResponse
from AdaptiveCheatSheet.forms import *
from AdaptiveCheatSheet.models import *
from django.shortcuts import render
from django.shortcuts import redirect
from django.template import loader
import datetime
from django.db.models import *
from django.db import connection
from django.views.generic.base import RedirectView


def save_note(request):
    print(request.method)
    print(request.POST)
    username = request.session['username']
    print(username)
    return 0

def favicon_view(request):
    RedirectView.as_view(url='/static/favicon.ico', permanent=True)


def contact_us(request):
    temp = loader.get_template('contact_us.html')
    return HttpResponse(temp.render({},request))

def logout(request):
    temp = loader.get_template('login.html')
    return HttpResponse(temp.render({},request))

def login(request):
    if request.method == 'GET':
        return render(request,'login.html',{})
    elif request.method =='POST':
        f = LoginForm(request.POST)
        user_enter = LoginForm()
        if f.is_valid():
            user_enter.username = f.cleaned_data['username']
            if User.objects.all().filter(username = user_enter.username) :
                request.session['username']= user_enter.username
                username = request.session['username']
                temp  = loader.get_template('index.html')
                context = {
                       'Username' : username
                }

                # ----------------------------Context Created-----------------------------#
                return HttpResponse(temp.render(context , request))
            else:
                return HttpResponse("<p> Username / Password not valid !!!  </p>")
        else:
            return HttpResponse("<p> Username / Password not valid !!!  </p>")


def register(request):
    if request.method=='GET':
        return render(request, 'register.html' , {})
    elif request.method == 'POST':
        f = RegisterForm(request.POST)
        if f.is_valid():
            user_obj = User()
            user_obj.name = f.cleaned_data['name']
            user_obj.username = f.cleaned_data['username']
            user_obj.password = f.cleaned_data['password']
            user_obj.tags = f.cleaned_data['tags']
            user_obj.save()
            return redirect('/login/')



