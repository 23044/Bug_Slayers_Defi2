from django import forms
from .models import Word, Comment

class WordForm(forms.ModelForm):
    class Meta:
        model = Word
        fields = ['word', 'definition', 'examples', 'word_type']
        widgets = {
            'examples': forms.Textarea(attrs={'rows': 3}),
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']
        widgets = {
            'text': forms.Textarea(attrs={'rows': 3}),
        } 