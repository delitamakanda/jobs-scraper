from django.contrib import admin
from apps.profiles.models import Candidate

class CandidateAdmin(admin.ModelAdmin):
    readonly_fields = ('created_at', 'updated_at')

admin.site.register(Candidate, CandidateAdmin)
