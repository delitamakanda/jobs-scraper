from rest_framework import serializers

class GenerateCoverLetterSerializer(serializers.Serializer):
    tone = serializers.ChoiceField(choices=['formal', 'informal', 'friendly'], default='formal')
    format = serializers.ChoiceField(choices=['linkedin', 'email', 'short_letter'], default='email')
    language = serializers.ChoiceField(choices=['en', 'es', 'fr'], default='fr')
    max_length = serializers.ChoiceField(choices=['short', 'medium', 'long'], default='medium')


class GenerateInterviewPrepSerializer(serializers.Serializer):
    focus = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        default=list,
    )

    difficulty = serializers.ChoiceField(
        choices=['mid', 'senior', 'expert'],
        default='senior',
    )

    language = serializers.ChoiceField(
        choices=['en', 'es', 'fr'],
        default='fr',
    )

