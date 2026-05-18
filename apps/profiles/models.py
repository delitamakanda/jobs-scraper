from django.db import models
from django.contrib.auth.models import User

class Candidate(models.Model):
    SENIORITY_LEVELS = (
        ('junior', 'Junior'),
        ('mid', 'Mid'),
        ('senior', 'Senior'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    summary = models.TextField(blank=True)
    years_of_experience = models.IntegerField(default=0)
    seniority = models.CharField(max_length=100, choices=SENIORITY_LEVELS, default='senior')

    main_skills = models.JSONField(default=list)
    secondary_skills = models.JSONField(default=list)
    industries = models.JSONField(default=list)
    projects = models.JSONField(default=list)

    preferred_locations = models.JSONField(default=list)
    remote_preference = models.CharField(max_length=20, choices=(('remote', 'Remote'), ('hybrid', 'Hybrid'), ('onsite', 'Onsite')), default='hybrid')

    target_salary_min = models.PositiveIntegerField(null=True, blank=True)
    target_salary_max = models.PositiveIntegerField(null=True, blank=True)

    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username} - {self.title}'
    
    class Meta:
        ordering = ['-created_at']
    
