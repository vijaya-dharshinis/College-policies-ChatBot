from django.urls import path
from .views import (
    DocumentListView,
    DocumentDetailView,
    ChatView,
    ChatClearView,
    FeedbackView,
    SearchView,
    DownloadCircularView,
    FAQListView,
    SettingsView,
    TestConnectionView
)

urlpatterns = [
    path('documents/', DocumentListView.as_view(), name='document-list'),
    path('documents/<uuid:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('chat/', ChatView.as_view(), name='chat'),
    path('chat/clear/', ChatClearView.as_view(), name='chat-clear'),
    path('feedback/', FeedbackView.as_view(), name='feedback'),
    path('search/', SearchView.as_view(), name='search'),
    path('download-circular/<str:slug>/', DownloadCircularView.as_view(), name='download-circular'),
    path('faqs/', FAQListView.as_view(), name='faqs'),
    path('settings/', SettingsView.as_view(), name='settings'),
    path('settings/test/', TestConnectionView.as_view(), name='settings-test'),
]
