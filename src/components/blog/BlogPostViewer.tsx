import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogPostViewerProps {
  post: BlogPost | null;
  open: boolean;
  onClose: () => void;
}

const formatMarkdown = (text: string) => {
  let formatted = text
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic
    .replace(/_(.*?)_/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">');

  return `<p class="mb-4">${formatted}</p>`;
};

export const BlogPostViewer = ({ post, open, onClose }: BlogPostViewerProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-2">
            <DialogTitle className="text-3xl">{post.title}</DialogTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
              {!post.published && <Badge variant="secondary">Draft</Badge>}
            </div>
          </div>
        </DialogHeader>
        <div 
          className="prose prose-sm max-w-none py-4"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content) }}
        />
      </DialogContent>
    </Dialog>
  );
};
