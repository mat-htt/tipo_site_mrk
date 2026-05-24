from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from . import views

router = DefaultRouter()
router.register(r'teachers', views.TeacherViewSet)
router.register(r'subjects', views.SubjectViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'schedule', views.ScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('users/me/', views.CurrentUserView.as_view(), name='current_user'),
]