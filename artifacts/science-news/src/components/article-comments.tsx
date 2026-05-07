import { useState } from "react";
import { useComments } from "@/hooks/use-engagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Trash2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface ArticleCommentsProps {
  articleId: number;
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const { comments, addComment, deleteComment } = useComments(articleId);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      addComment(name, message);
      setMessage("");
      setSubmitting(false);
    }, 300);
  };

  return (
    <div className="py-8 border-t border-white/10" data-testid="article-comments">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold">
          Mission Debrief
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-mono text-muted-foreground font-normal">
              ({comments.length} comment{comments.length !== 1 ? "s" : ""})
            </span>
          )}
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-white/5 rounded-2xl p-5 mb-8" data-testid="comment-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Input
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            maxLength={50}
            className="bg-background/50 border-white/10 rounded-xl"
            data-testid="input-comment-name"
          />
          <div className="text-xs text-muted-foreground flex items-center px-1">
            Your name will appear publicly with your comment.
          </div>
        </div>
        <Textarea
          placeholder="Share your thoughts on this transmission..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          maxLength={500}
          rows={3}
          className="bg-background/50 border-white/10 rounded-xl mb-3 resize-none"
          data-testid="input-comment-message"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">{message.length}/500</span>
          <Button
            type="submit"
            size="sm"
            disabled={submitting || !name.trim() || !message.trim()}
            className="rounded-full gap-2"
            data-testid="btn-comment-submit"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? "Transmitting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground" data-testid="comments-empty">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No comments yet. Be the first to share your thoughts.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {comments.map(comment => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-white/5 rounded-2xl p-5 group"
                data-testid={`comment-${comment.id}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm">{comment.name}</span>
                      <span className="text-xs text-muted-foreground ml-2 font-mono">
                        {format(new Date(comment.date), "MMM d, yyyy · h:mm a")}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => deleteComment(comment.id)}
                    data-testid={`btn-delete-comment-${comment.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                  {comment.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
