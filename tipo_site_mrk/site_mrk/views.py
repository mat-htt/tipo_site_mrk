from django.shortcuts import render, redirect, get_object_or_404
from .models import Schedule, Group, Teacher, Subject
from .forms import ScheduleForm


def index(request):
    group_id = request.GET.get('group')
    schedules = Schedule.objects.all()
    if group_id:
        schedules = schedules.filter(group_id=group_id)

    return render(request, 'site_mrk/index.html', {
        'schedules': schedules,
        'groups': Group.objects.all(),
        'selected_group': int(group_id) if group_id and group_id.isdigit() else None
    })


def schedule_add(request):
    form = ScheduleForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('index')
    return render(request, 'site_mrk/form.html', {'form': form, 'title': 'Добавить занятие'})


def schedule_edit(request, pk):
    instance = get_object_or_404(Schedule, pk=pk)
    form = ScheduleForm(request.POST or None, instance=instance)
    if form.is_valid():
        form.save()
        return redirect('index')
    return render(request, 'site_mrk/form.html', {'form': form, 'title': 'Редактировать'})


def list_teachers(request):
    return render(request, 'site_mrk/list.html', {'items': Teacher.objects.all(), 'title': 'Преподаватели'})


def list_subjects(request):
    return render(request, 'site_mrk/list.html', {'items': Subject.objects.all(), 'title': 'Предметы'})


def list_groups(request):
    return render(request, 'site_mrk/list.html', {'items': Group.objects.all(), 'title': 'Группы'})