from django.db import models

class Teacher(models.Model):
    name = models.CharField("ФИО преподавателя", max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Преподаватель"
        verbose_name_plural = "Преподаватели"


class Subject(models.Model):
    title = models.CharField("Предмет", max_length=100)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Предмет"
        verbose_name_plural = "Предметы"


class Group(models.Model):
    name = models.CharField("Группа", max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Группа"
        verbose_name_plural = "Группы"


class Schedule(models.Model):
    DAYS_OF_WEEK = [
        ('Пн', 'Понедельник'),
        ('Вт', 'Вторник'),
        ('Ср', 'Среда'),
        ('Чт', 'Четверг'),
        ('Пт', 'Пятница'),
        ('Сб', 'Суббота'),
    ]

    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name="Группа")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, verbose_name="Предмет")
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, verbose_name="Преподаватель")
    day_of_week = models.CharField("День недели", max_length=2, choices=DAYS_OF_WEEK)
    time = models.TimeField("Время занятия")

    class Meta:
        ordering = ['day_of_week', 'time']
        verbose_name = "Занятие"
        verbose_name_plural = "Расписание"

    def __str__(self):
        return f"{self.get_day_of_week_display()} {self.time} - {self.group} - {self.subject}"