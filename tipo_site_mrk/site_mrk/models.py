from django.db import models

class Teacher(models.Model):
    name = models.CharField("ФИО преподавателя", max_length=100)
    def __str__(self): return self.name

class Subject(models.Model):
    title = models.CharField("Предмет", max_length=100)
    def __str__(self): return self.title

class Group(models.Model):
    name = models.CharField("Группа", max_length=50)
    def __str__(self): return self.name

class Schedule(models.Model):
    DAYS = [
        ('1', 'Понедельник'), ('2', 'Вторник'), ('3', 'Среда'),
        ('4', 'Четверг'), ('5', 'Пятница'), ('6', 'Суббота')
    ]
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    day_of_week = models.CharField("День недели", max_length=1, choices=DAYS)
    time = models.TimeField("Время")

    class Meta:
        ordering = ['day_of_week', 'time']