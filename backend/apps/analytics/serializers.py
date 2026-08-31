from rest_framework import serializers


class AnalyticsSummarySerializer(serializers.Serializer):
    total_courses = serializers.IntegerField()
    total_assignments = serializers.IntegerField()
    total_students = serializers.IntegerField()
    average_marks = serializers.FloatField()
    attendance_percentage = serializers.FloatField()
    pending_assignments = serializers.IntegerField()
