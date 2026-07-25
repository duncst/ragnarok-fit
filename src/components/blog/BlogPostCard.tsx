import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogPostCardProps {
  post: BlogPost;
  isAdmin: boolean;
  onEdit?: (post: BlogPost) => void;
  onDelete?: (id: string) => void;
  onView?: (post: BlogPost) => void;
}

export const BlogPostCard = ({ post, isAdmin, onEdit, onDelete, onView }: BlogPostCardProps) => {
  const excerpt = post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '');

  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onView?.(post)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
              {!post.published && <Badge variant="secondary">Draft</Badge>}
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(post)}
                aria-label={`Edit "${post.title}"`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(post.id)}
                aria-label={`Delete "${post.title}"`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{excerpt}</p>
      </CardContent>
    </Card>
  );
};
