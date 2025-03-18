from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

User = get_user_model()

class Word(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('review', 'En révision'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]

    WORD_TYPE_CHOICES = [
        ('root', 'Mot racine'),
        ('derived', 'Mot dérivé'),
    ]

    word = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    definition = models.TextField()
    examples = models.JSONField(default=list)  # Liste d'exemples d'utilisation
    variants = models.JSONField(default=list)  # Variantes générées par l'IA
    word_type = models.CharField(max_length=10, choices=WORD_TYPE_CHOICES, default='derived')
    is_challenge_word = models.BooleanField(default=False)  # Pour le challenge des 1000 mots
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    contributor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='contributed_words')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Champs pour le système de vote et de points
    votes = models.ManyToManyField(User, through='WordVote', related_name='voted_words')
    vote_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['word']),
            models.Index(fields=['status']),
            models.Index(fields=['word_type']),
        ]

    def __str__(self):
        return self.word

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.word)
        super().save(*args, **kwargs)

class WordVote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'word')

class Comment(models.Model):
    word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.user.username} on {self.word.word}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    points = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    badges = models.JSONField(default=list)
    
    # Statistiques de contribution
    words_contributed = models.IntegerField(default=0)
    words_approved = models.IntegerField(default=0)
    challenge_words_contributed = models.IntegerField(default=0)

    def calculate_level(self):
        # Calcul du niveau basé sur les points
        self.level = (self.points // 100) + 1
        return self.level

class ImportedDocument(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente de traitement'),
        ('processing', 'En cours de traitement'),
        ('completed', 'Traitement terminé'),
        ('error', 'Erreur'),
    ]

    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='documents/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # Stockage des mots extraits non reconnus
    unknown_words = models.JSONField(default=list)
    
    class Meta:
        ordering = ['-uploaded_at']

class Challenge(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    target_words = models.IntegerField(default=1000)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    # Progression
    completed_words = models.IntegerField(default=0)
    progress_percentage = models.FloatField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    def update_progress(self):
        total_approved = Word.objects.filter(
            word_type='root',
            status='approved'
        ).count()
        
        self.completed_words = total_approved
        self.progress_percentage = (total_approved / self.target_words) * 100
        self.save()

    def __str__(self):
        return self.title

    def get_progress(self):
        completed_words = Word.objects.filter(
            is_challenge_word=True,
            status='approved'
        ).count()
        return (completed_words / self.target_words) * 100

class UserContribution(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    words_contributed = models.IntegerField(default=0)
    words_approved = models.IntegerField(default=0)
    last_contribution = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Contributions de {self.user.username}" 