from django.contrib import admin
from .models import Teacher, Subject, Group, Schedule


admin.site.register(Teacher)
admin.site.register(Subject)
admin.site.register(Group)


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'time', 'group', 'subject', 'teacher')
    list_filter = ('group', 'day_of_week')