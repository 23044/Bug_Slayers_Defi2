from django.shortcuts import render, redirect, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import ListView, UpdateView, DeleteView, View
from django.urls import reverse_lazy
from django.contrib import messages
from .serializers import UserSerializer, RegisterSerializer
from django import forms
from django.http import HttpResponseRedirect
from django.db.models import Q

User = get_user_model()

class RegisterView(View):
    template_name = 'accounts/register.html'

    def get(self, request):
        return render(request, self.template_name)

    def post(self, request):
        serializer = RegisterSerializer(data=request.POST)
        if serializer.is_valid():
            user = serializer.save()
            
            # Créer un profil utilisateur par défaut
            from dictionary.models import UserProfile
            UserProfile.objects.create(
                user=user,
                points=0,
                level=1,
                words_contributed=0,
                words_approved=0
            )
            
            # Par défaut, les nouveaux inscrits sont des contributeurs normaux
            user.is_staff = False
            user.is_superuser = False
            user.save()
            
            messages.success(request, "Compte créé avec succès! Vous pouvez maintenant contribuer au dictionnaire.")
            login(request, user)
            return redirect('profile')
        else:
            for error in serializer.errors.values():
                messages.error(request, error[0])
            return render(request, self.template_name)

class LoginView(View):
    template_name = 'accounts/login.html'

    def get(self, request):
        if request.user.is_authenticated:
            return redirect('profile')
        return render(request, self.template_name)

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = User.objects.filter(username=username).first()
        
        if user and user.check_password(password):
            login(request, user)
            messages.success(request, "Connexion réussie!")
            return redirect('profile')
        else:
            messages.error(request, "Identifiants invalides")
            return render(request, self.template_name)

class LogoutView(LoginRequiredMixin, View):
    def get(self, request):
        logout(request)
        messages.success(request, "Vous avez été déconnecté avec succès!")
        return redirect('login')

class UserListView(LoginRequiredMixin, UserPassesTestMixin, ListView):
    model = User
    template_name = 'accounts/user_list.html'
    context_object_name = 'users'
    paginate_by = 20
    
    def test_func(self):
        return self.request.user.is_staff
    
    def handle_no_permission(self):
        if not self.request.user.is_authenticated:
            messages.error(self.request, "Veuillez vous connecter pour accéder à cette page.")
            return redirect('login')
        messages.error(self.request, "Vous n'avez pas la permission d'accéder à cette page. Seuls les administrateurs et les modérateurs y ont accès.")
        return redirect('home')
    
    def get_queryset(self):
        queryset = User.objects.select_related('profile').order_by('-date_joined')
        
        # Filtrer par rôle
        role = self.request.GET.get('role')
        if role == 'admin':
            queryset = queryset.filter(is_superuser=True)
        elif role == 'staff':
            queryset = queryset.filter(is_staff=True, is_superuser=False)
        elif role == 'user':
            queryset = queryset.filter(is_staff=False, is_superuser=False)
        
        # Filtrer par statut
        status = self.request.GET.get('status')
        if status == 'active':
            queryset = queryset.filter(is_active=True)
        elif status == 'inactive':
            queryset = queryset.filter(is_active=False)
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_role'] = self.request.GET.get('role', '')
        context['current_status'] = self.request.GET.get('status', '')
        return context

class ProfileView(LoginRequiredMixin, View):
    def get(self, request):
        return redirect('update_user', pk=request.user.pk)

class UserUpdateForm(forms.ModelForm):
    new_password = forms.CharField(widget=forms.PasswordInput(), required=False)
    confirm_password = forms.CharField(widget=forms.PasswordInput(), required=False)
    
    class Meta:
        model = User
        fields = ['username', 'email']
        
    def clean(self):
        cleaned_data = super().clean()
        new_password = cleaned_data.get('new_password')
        confirm_password = cleaned_data.get('confirm_password')
        
        if new_password and new_password != confirm_password:
            raise forms.ValidationError("Les mots de passe ne correspondent pas.")
        
        return cleaned_data

class UserUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = User
    form_class = UserUpdateForm
    template_name = 'accounts/update_profile.html'
    success_url = reverse_lazy('user_list')
    
    def test_func(self):
        # Only staff can edit other users, users can only edit themselves
        return self.request.user.is_staff or self.request.user.pk == self.get_object().pk
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas la permission de modifier ce profil.")
        return redirect('user_list')
    
    def form_valid(self, form):
        user = form.save(commit=False)
        
        # Handle password change if provided
        new_password = form.cleaned_data.get('new_password')
        if new_password:
            user.set_password(new_password)
        
        # Handle role changes (staff only)
        if self.request.user.is_staff:
            role = self.request.POST.get('role')
            is_active = self.request.POST.get('is_active') == 'on'
            
            # Prevent staff from modifying superuser status unless they are superuser
            if not self.request.user.is_superuser and user.is_superuser:
                messages.error(self.request, "Vous ne pouvez pas modifier un administrateur.")
                return self.form_invalid(form)
            
            user.is_active = is_active
            if role == 'admin' and self.request.user.is_superuser:
                user.is_staff = True
                user.is_superuser = True
            elif role == 'staff':
                user.is_staff = True
                user.is_superuser = False
            else:  # role == 'user'
                user.is_staff = False
                user.is_superuser = False
        
        user.save()
        messages.success(self.request, "Le profil a été mis à jour avec succès.")
        return redirect(self.get_success_url())

def create_user(request):
    if not request.user.is_staff:
        messages.error(request, "Vous n'avez pas la permission de créer des utilisateurs.")
        return redirect('user_list')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        role = request.POST.get('role')
        
        if User.objects.filter(Q(username=username) | Q(email=email)).exists():
            messages.error(request, "Un utilisateur avec ce nom ou cet email existe déjà.")
            return redirect('user_list')
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        if role == 'admin' and request.user.is_superuser:
            user.is_staff = True
            user.is_superuser = True
        elif role == 'staff':
            user.is_staff = True
        
        user.save()
        messages.success(request, f"L'utilisateur {username} a été créé avec succès.")
        return redirect('user_list')
    
    return redirect('user_list')

class UserDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = User
    success_url = reverse_lazy('user_list')
    
    def test_func(self):
        return self.request.user.is_staff and not self.get_object().is_superuser
    
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        messages.success(request, f"L'utilisateur {user.username} a été supprimé avec succès.")
        return super().delete(request, *args, **kwargs)
