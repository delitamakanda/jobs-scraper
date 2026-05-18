from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from apps.profiles.models import Candidate

@receiver(post_save, sender=User)
def create_candidate(sender, instance, created, **kwargs):
    if created:
        Candidate.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_candidate(sender, instance, **kwargs):
    if hasattr(instance, 'user'):
        instance.user.save()