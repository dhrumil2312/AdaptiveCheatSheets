from django import forms

class RegisterForm(forms.Form):
    name = forms.CharField(max_length=100)
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100)
    tags = forms.CharField(max_length=500)


class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(max_length=100)

class NotesForm(forms.Form):
    title = forms.CharField(max_length=1000)
    tags = forms.CharField(max_length=1000)
    content = forms.CharField(max_length=5000)
