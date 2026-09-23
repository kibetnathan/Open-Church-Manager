from rest_framework.response import Response
from rest_framework import viewsets, permissions
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from soft_delete import SoftDeleteViewSetMixin
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, FormParser

class PostViewSet(SoftDeleteViewSetMixin, viewsets.ModelViewSet):
    """
    CRUD endpoints for community Posts.

    Posts are newest-first and accept multipart uploads so authors can attach an image.
    The authenticated user is stamped as `author` and the server sets `published_date`
    on create.

    Routes (router prefix 'posts/'):
        GET    /posts/         — list posts newest-first
        POST   /posts/         — create a post (multipart: title, text, tags, image)
        GET    /posts/{id}/    — retrieve a single post
        PUT    /posts/{id}/    — replace a post
        PATCH  /posts/{id}/    — partial update
        DELETE /posts/{id}/    — delete a post
    """
    queryset = Post.objects.all().order_by('-published_date')
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, published_date=timezone.now())

class CommentViewSet(SoftDeleteViewSetMixin, viewsets.ModelViewSet):
    """
    CRUD endpoints for Comments on Posts.

    Supports filtering by post via the `?post=<id>` query parameter so clients can
    fetch the comment thread for a given post. The authenticated user is stamped as
    `author` on create.

    Routes (router prefix 'comments/'):
        GET    /comments/?post={id} — list comments, optionally filtered by post
        POST   /comments/           — create a comment
        GET    /comments/{id}/      — retrieve a single comment
        PUT    /comments/{id}/      — replace a comment
        PATCH  /comments/{id}/      — partial update
        DELETE /comments/{id}/      — delete a comment
    """
    queryset = Comment.objects.all().order_by('created_at')  # ← add this back
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Comment.objects.all().order_by('created_at')
        post_id = self.request.query_params.get('post')
        if post_id:
            qs = qs.filter(post_id=post_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, post_id):
    """
    Toggle the authenticated user's like on a Post.

    If the user has already liked the post, the like is removed; otherwise it is added.
    Returns the new liked-state for the current user and the total like count.

    Response: { "liked": bool, "like_count": int }
    """
    post = get_object_or_404(Post, id=post_id)
    user = request.user

    if post.liked_by.filter(id=user.id).exists():
        post.liked_by.remove(user)
        liked = False
    else:
        post.liked_by.add(user)
        liked = True

    return Response({
        'liked': liked,
        'like_count': post.liked_by.count()
    })