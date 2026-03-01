from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('schedule/add/', views.schedule_add, name='schedule_add'),
    path('schedule/edit/<int:pk>/', views.schedule_edit, name='schedule_edit'),
    path('teachers/', views.list_teachers, name='teachers'),
    path('subjects/', views.list_subjects, name='subjects'),
    path('groups/', views.list_groups, name='groups'),
]