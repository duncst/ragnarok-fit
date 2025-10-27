import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const formatButtons = [
    { icon: Heading1, action: () => handleFormat('# ', '\n'), label: 'Heading 1' },
    { icon: Heading2, action: () => handleFormat('## ', '\n'), label: 'Heading 2' },
    { icon: Bold, action: () => handleFormat('**', '**'), label: 'Bold' },
    { icon: Italic, action: () => handleFormat('_', '_'), label: 'Italic' },
    { icon: List, action: () => handleFormat('- ', '\n'), label: 'Bullet List' },
    { icon: ListOrdered, action: () => handleFormat('1. ', '\n'), label: 'Numbered List' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex gap-1 flex-wrap border border-input rounded-md p-2 bg-background">
        {formatButtons.map((btn, idx) => (
          <Button
            key={idx}
            type="button"
            variant="ghost"
            size="sm"
            onClick={btn.action}
            title={btn.label}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[400px] font-mono"
        placeholder="Write your blog post content here... (Markdown supported)"
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelectionStart(target.selectionStart);
          setSelectionEnd(target.selectionEnd);
        }}
      />
    </div>
  );
};
