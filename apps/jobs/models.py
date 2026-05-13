from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class JobOffer(models.Model):
    class Source(models.TextChoices):
        LINKEDIN = 'LinkedIn'
        HELLOWORK = 'HelloWork'
        OTHER = 'Other'
    source = models.CharField(max_length=50, choices=Source.choices, default=Source.OTHER)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100, blank=True, null=True)
    url = models.URLField(blank=True, null=True)

    raw_description = models.TextField()

    location = models.CharField(max_length=100, blank=True, null=True)
    remote_policy = models.CharField(max_length=100, blank=True, null=True)
    contract_type = models.CharField(max_length=100, blank=True, null=True)
    
    required_skills = models.JSONField(default=list)
    nice_to_have_skills = models.JSONField(default=list)
    extracted_skills = models.JSONField(default=list)

    seniority = models.CharField(max_length=100, blank=True, null=True)
    business_domain = models.CharField(max_length=100, blank=True, null=True)

    ai_summary = models.TextField(blank=True, null=True)
    red_flag = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']



class JobMatch(models.Model):
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE)
    score = models.PositiveIntegerField()
    strengths = models.JSONField(default=list)
    weaknesses = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    recommendations = models.JSONField(default=list)
    generated_pitch = models.TextField(blank=True, null=True)
    generated_cover_letter = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_offer.title} - {self.score}"
    
    class Meta:
        ordering = ['-created_at']