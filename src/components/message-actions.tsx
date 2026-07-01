import { Copy, RefreshCcw, Share2, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";
import { getFeedback, setFeedback, clearFeedback, type FeedbackRating } from "@/lib/feedback";

interface Props {
  threadId: string;
  messageId: string;
  question: string;
  answer: string;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
}

export function MessageActions({
  threadId,
  messageId,
  question,
  answer,
  onRegenerate,
  showRegenerate,
}: Props) {
  const [rating, setRating] = useState<FeedbackRating | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setRating(getFeedback(messageId));
    setSaved(isBookmarked(messageId));
  }, [messageId]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  const onShare = async () => {
    const shareData = {
      title: "HalfPace TaxGPT",
      text: `Q: ${question}\n\nA: ${answer}`,
    };
    try {
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      /* fall through */
    }
    try {
      await navigator.clipboard.writeText(shareData.text);
      toast.success("Response copied — ready to share");
    } catch {
      toast.error("Could not share");
    }
  };

  const rate = (r: FeedbackRating) => {
    if (rating === r) {
      clearFeedback(messageId);
      setRating(null);
      return;
    }
    setFeedback({ threadId, messageId, rating: r, question, answer });
    setRating(r);
    toast.success(r === "up" ? "Thanks for the feedback!" : "Thanks — we'll improve this.");
  };

  const onSave = () => {
    const nowSaved = toggleBookmark({ threadId, messageId, question, answer });
    setSaved(nowSaved);
    toast.success(nowSaved ? "Saved to bookmarks" : "Removed from bookmarks");
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-0.5 text-muted-foreground">
      <ActionBtn label="Copy" onClick={onCopy}>
        <Copy className="h-3.5 w-3.5" />
      </ActionBtn>
      {showRegenerate && onRegenerate && (
        <ActionBtn label="Regenerate" onClick={onRegenerate}>
          <RefreshCcw className="h-3.5 w-3.5" />
        </ActionBtn>
      )}
      <ActionBtn
        label="Helpful"
        active={rating === "up"}
        activeClass="text-primary"
        onClick={() => rate("up")}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </ActionBtn>
      <ActionBtn
        label="Not helpful"
        active={rating === "down"}
        activeClass="text-destructive"
        onClick={() => rate("down")}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </ActionBtn>
      <ActionBtn label="Share" onClick={onShare}>
        <Share2 className="h-3.5 w-3.5" />
      </ActionBtn>
      <ActionBtn
        label={saved ? "Saved" : "Save"}
        active={saved}
        activeClass="text-amber-500"
        onClick={onSave}
      >
        <Star className={cn("h-3.5 w-3.5", saved && "fill-current")} />
      </ActionBtn>
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  active,
  activeClass,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  activeClass?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="icon-sm"
      variant="ghost"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn("h-8 w-8", active && activeClass)}
    >
      {children}
    </Button>
  );
}
