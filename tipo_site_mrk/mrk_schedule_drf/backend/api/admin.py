from django.contrib import admin
from .models import Teacher, Subject, Group, Schedule

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ['title']
    search_fields = ['title']

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['day_of_week', 'time', 'group', 'subject', 'teacher']
    list_filter = ['group', 'day_of_week']
    search_fields = ['group__name', 'subject__title', 'teacher__name']