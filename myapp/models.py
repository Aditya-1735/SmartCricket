from django.db import models

class MatchPrediction(models.Model):
    match_id = models.CharField(max_length=100)
    predicted_score = models.IntegerField()
    win_probability = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

# Create your models here.
