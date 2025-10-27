import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from './RichTextEditor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  published: boolean;
}

interface BlogPostEditorProps {
  post?: BlogPost;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const BlogPostEditor = ({ post, open, onClose, onSave }: BlogPostEditorProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
    } else {
      setTitle('');
      setContent('');
      setPublished(false);
    }
  }, [post]);

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save posts');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
        published,
        author_id: user.id,
      };

      if (post?.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;
        toast.success('Post updated successfully');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        toast.success('Post created successfully');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post?.id ? 'Edit Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
