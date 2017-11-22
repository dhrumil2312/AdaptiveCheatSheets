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
import  json
from django.db import  connection


def get_notes(request):
    cursor = connection.cursor()
    username = request.session['username']
    a = "select 1 as id from \"AdaptiveCheatSheet_user\" where username = '%s' " % (username)
    _ = cursor.execute(a)
    rows = cursor.fetchall()
    id = rows[0][0]
    print(id , username)

    all_note_obj = Notes.objects.all().filter(author_id = id)
    print(all_note_obj)
    context = {
        'all_note_obj': all_note_obj,
        'Username': username,
    }
    return HttpResponse(context,content_type="application/json")


def save_note(request):
    username = request.session['username']
    print(username)
    data = json.loads(request.body)
    note_obj = Notes()
    note_obj.content = data['content']
    note_obj.title = data['title']
    note_obj.tag = data['tags']
    note_obj.upvote = 0
    note_obj.downvote = 0
    note_obj.view_count = 0
    cursor = connection.cursor()
    a = "select 1 as id , max(id) max_id from \"AdaptiveCheatSheet_notes\""
    _ = cursor.execute(a)
    rows = cursor.fetchall()
    print(rows[0][1]+1)
    note_obj.note_id = rows[0][1]+1
    a = "select 1 as id from \"AdaptiveCheatSheet_user\" where username = '%s' " % (username)
    _ = cursor.execute(a)
    rows = cursor.fetchall()
    #print(rows[0][0])
    note_obj.author_id = rows[0][0]
    note_obj.type = 1
    note_obj.save()
    temp = loader.get_template('index.html')
    return HttpResponse(temp.render({}, request))

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
        print(request.POST)
        user_enter = LoginForm()
        if f.is_valid():
            user_enter.username = f.cleaned_data['username']
            if User.objects.all().filter(username = user_enter.username) :
                request.session['username']= user_enter.username
                username = request.session['username']
                temp  = loader.get_template('index.html')

                context = {
                       'Username' : username,
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



