import uuid
from django.db import models

class Document(models.Model):
    STATUS_CHOICES = (
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('error', 'Error'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='documents/', null=True, blank=True)
    file_type = models.CharField(max_length=20, default='pdf')
    size_bytes = models.BigIntegerField(default=0)
    page_count = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    is_default = models.BooleanField(default=False)
    content_text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.status})"


class DocumentChunk(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.IntegerField(default=0)
    section_title = models.CharField(max_length=255, default='General')
    page_number = models.IntegerField(default=1)
    content = models.TextField()

    def __str__(self):
        return f"[{self.document.name}] {self.section_title} (P.{self.page_number})"


class ChatSession(models.Model):
    session_id = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.session_id


class ChatMessage(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('assistant', 'Assistant'),
    )

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    card_data = models.JSONField(default=dict, blank=True)
    references = models.JSONField(default=list, blank=True)
    citations = models.JSONField(default=list, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role}: {self.content[:40]}"


class Feedback(models.Model):
    RATING_CHOICES = (
        ('up', 'Thumbs Up'),
        ('down', 'Thumbs Down'),
    )
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, null=True, blank=True)
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.CharField(max_length=10, choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback {self.rating} at {self.created_at}"
