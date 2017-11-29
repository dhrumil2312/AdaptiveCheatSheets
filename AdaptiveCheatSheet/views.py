from django.http import HttpResponse
from AdaptiveCheatSheet.forms import *
from AdaptiveCheatSheet.models import *
from django.shortcuts import render
from django.shortcuts import redirect
from django.template import loader
import datetime
from django.core import serializers
from django.db.models import *
from django.db import connection
from django.views.generic.base import RedirectView
import  json
from django.db import  connection
import requests

def get_notes_bytag(request):
    cursor = connection.cursor()
    username = request.session['username']
    a = "select 1 as id , tags from \"AdaptiveCheatSheet_user\" where username = '%s' " % (username)
    _ = cursor.execute(a)
    rows = cursor.fetchall()
    user_tags = set(filter(None , rows[0][1].split(';')))
    print(user_tags)
    return_obj = Notes.objects.none()
    all_note_obj = Notes.objects.all()
    id = []
    for obj in all_note_obj:
        all_tags = set(filter(None,obj.tag.split(';')))
        if not set(user_tags).isdisjoint(all_tags):
            id.append(obj.id)
    print(id)

    queryset = Notes.objects.filter(id__in=id)
    return queryset


def user_activity(request):
    temp = loader.get_template("UserActivityChart.html")
    return HttpResponse(temp.render({} , request))

def get_notes(request):
    cursor = connection.cursor()
    username = request.session['username']
    a = "select 1 as id from \"AdaptiveCheatSheet_user\" where username = '%s' " % (username)
    _ = cursor.execute(a)
    rows = cursor.fetchall()
    id = rows[0][0]
    print(id , username)

    all_note_obj = Notes.objects.all().filter(author_id = id)
    all_note_obj = serializers.serialize('json', all_note_obj)
    print(all_note_obj)
    context = {
        'all_note_obj': all_note_obj,
        'Username': username,
    }
    return HttpResponse(all_note_obj,content_type="application/json")


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
    #print(rows[0][1]+1)
    note_id = rows[0][1]+1
    note_obj.note_id = note_id
    a = "select 1 as id from \"AdaptiveCheatSheet_user\" where username = '%s' " % (username)
    _ = cursor.execute(a)
    rows = cursor.fetchall()
    author_id = rows[0][0]
    note_obj.author_id = author_id
    note_obj.type = 1
    note_obj.save()
    # Code to save note on elastic search
    content = {"note_id" : note_id,
               "author_id": author_id,
               "type" : "1",
               "title": data['title'],
               "tag": data['tags'],
               "content": data['content']}

    headers = {'content-type': 'application/json'}
    url = 'http://localhost:9200/adaptivecheatsheets/data/' + str(note_id+100)
    print(url)
    r = requests.put(url, headers=headers, data=json.dumps(content))
    print(r.content)
    print(r.status_code)
    # Code end for elastic search note save.
    # return of the function
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
                get_notes_bytag(request)
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