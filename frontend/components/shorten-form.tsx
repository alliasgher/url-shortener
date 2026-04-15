"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shortenUrl } from "@/lib/api";
import type { LinkResponse } from "@/lib/types";

interface ShortenFormProps {
  onResult: (link: LinkResponse) => void;
}

export function ShortenForm({ onResult }: ShortenFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slowWarning, setSlowWarning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (loading) {
      timerRef.current = setTimeout(() => setSlowWarning(true), 3000);
    } else {
      setSlowWarning(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const link = await shortenUrl(url.trim());
      onResult(link);
      setUrl("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-3">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Paste your long URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-11 bg-card text-sm"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="h-11 bg-navy hover:bg-navy-light text-white px-5 font-medium"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Shorten
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-coral">{error}</p>
      )}
      {slowWarning && (
        <p className="text-xs text-text-muted animate-in fade-in">
          Server is waking up from sleep — free tier cold start. This takes ~30 seconds on the first request.
        </p>
      )}
    </form>
  );
}
