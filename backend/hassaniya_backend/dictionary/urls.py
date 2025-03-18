from django.urls import path
from . import views

app_name = 'dictionary'

urlpatterns = [
    # Pages principales
    path('', views.DictionaryView.as_view(), name='home'),
    path('moderate/', views.ModerateWordsView.as_view(), name='moderate_words'),
    path('challenge/', views.ChallengeView.as_view(), name='challenge'),
    path('manage-challenge/', views.ManageChallengeView.as_view(), name='manage_challenge'),
    path('import/', views.ImportDocumentView.as_view(), name='import_document'),
    path('download-template/', views.download_template, name='download_template'),
    
    # Actions sur les mots
    path('submit/', views.submit_word, name='submit_word'),
    path('word/<int:word_id>/approve/', views.approve_word, name='approve_word'),
    path('word/<int:word_id>/reject/', views.reject_word, name='reject_word'),
    path('word/<int:word_id>/comment/', views.add_comment, name='add_comment'),
    path('word/<int:word_id>/vote/', views.vote_word, name='vote_word'),
    
    # Pages statiques
    path('contribution-guide/', views.contribution_guide, name='contribution_guide'),
    path('transcription-rules/', views.transcription_rules, name='transcription_rules'),
    path('contributors/', views.contributors_list, name='contributors'),
] 