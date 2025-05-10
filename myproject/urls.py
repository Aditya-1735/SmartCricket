"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from myapp import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.Home,name='home'),
    path('about/',views.about,name="about"),
    path('api/fetch-live-score/', views.fetch_match_details, name='fetch_live_score'),
    path('api/predict-score/', views.predict_score_view, name='predict_score'),
    path('api/commentary/', views.generate_commentary_view, name='commentary'),
    path('api/match-details/', views.get_match_details, name='match-details'),
    path('api/match/<str:match_id>/', views.get_single_match, name='get_single_match'),
]
