from rest_framework import serializers
from .models import Teacher, Subject, Group, Schedule


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)
    subject_title = serializers.CharField(source='subject.title', read_only=True)
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)

    class Meta:
        model = Schedule
        fields = '__all__'