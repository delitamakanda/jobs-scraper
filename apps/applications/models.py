from django.db import models
from django.contrib.auth.models import User
from apps.jobs.models import JobOffer

class Application(models.Model):
    class Status(models.TextChoices):
        SAVED = 'SAVED', 'Saved'
        APPLIED = 'APPLIED', 'Applied'
        INTERVIEWED = 'INTERVIEWED', 'Interviewed'
        REJECTED = 'REJECTED', 'Rejected'
        OFFER = 'OFFER', 'Offer'

    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='application')

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SAVED)
    notes = models.TextField(blank=True, null=True)
    next_action = models.CharField(max_length=255, blank=True, null=True)
    applied_at = models.DateTimeField(blank=True, null=True)
    interview_at = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.job_offer.job.title} - {self.job_offer.user.first_name} {self.job_offer.user.last_name}'
    
    class Meta:
        ordering = ['-created_at']

