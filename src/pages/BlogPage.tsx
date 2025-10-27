import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { BlogPostEditor } from '@/components/blog/BlogPostEditor';
import { BlogPostViewer } from '@/components/blog/BlogPostViewer';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const BlogPage = () => {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setSelectedPost(null);
    setEditorOpen(true);
  };

  const handleView = (post: BlogPost) => {
    setSelectedPost(post);
    setViewerOpen(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postToDelete);

      if (error) throw error;
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  if (loading || adminLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Ragnarok Fit Blog</h1>
            <p className="text-muted-foreground">Training insights and updates</p>
          </div>
          {isAdmin && (
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No blog posts yet. {isAdmin && 'Create your first post to get started!'}
            </p>
          ) : (
            posts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={confirmDelete}
                onView={handleView}
              />
            ))
          )}
        </div>

        <BlogPostEditor
          post={selectedPost || undefined}
          open={editorOpen}
          onClose={() => {
            setEditorOpen(false);
            setSelectedPost(null);
          }}
          onSave={fetchPosts}
        />

        <BlogPostViewer
          post={selectedPost}
          open={viewerOpen}
          onClose={() => {
            setViewerOpen(false);
            setSelectedPost(null);
          }}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
};

export default BlogPage;
