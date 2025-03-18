from django.core.management.base import BaseCommand
from django.utils import timezone
from dictionary.models import Challenge

class Command(BaseCommand):
    help = 'Initialize the default challenge'

    def handle(self, *args, **kwargs):
        if not Challenge.objects.exists():
            Challenge.objects.create(
                title="Challenge des 1000 mots racines",
                description="Contribuez à la documentation des 1000 mots racines les plus utilisés en hassaniya.",
                target_words=1000,
                start_date=timezone.now(),
                is_active=True
            )
            self.stdout.write(self.style.SUCCESS('Challenge initial créé avec succès!')) 