from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from dictionary.models import UserProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Crée des profils utilisateurs pour les utilisateurs existants qui n\'en ont pas'

    def handle(self, *args, **kwargs):
        users_without_profile = User.objects.filter(profile__isnull=True)
        profiles_created = 0

        for user in users_without_profile:
            UserProfile.objects.create(user=user)
            profiles_created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Profils créés avec succès pour {profiles_created} utilisateur(s)'
            )
        ) 