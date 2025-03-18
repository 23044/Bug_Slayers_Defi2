from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:pk>/update/', views.UserUpdateView.as_view(), name='update_user'),
    path('users/<int:pk>/delete/', views.UserDeleteView.as_view(), name='delete_user'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
]
