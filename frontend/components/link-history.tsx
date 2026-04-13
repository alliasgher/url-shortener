"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, BarChart3, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { getHistory, clearHistory, type HistoryItem } from "@/lib/history";

export function LinkHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Re-check on window focus (in case another tab changed it)
  useEffect(() => {
    function onFocus() {
      setHistory(getHistory());
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (history.length === 0) return null;

  function handleClear() {
    clearHistory();
    setHistory([]);
  }

  return (
    <div className="w-full max-w-xl mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-deep">
          <Clock className="h-4 w-4 text-text-muted" />
          Recent Links
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-xs text-text-muted hover:text-coral gap-1"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardContent className="divide-y divide-border pt-2">
          {history.map((item) => (
            <div key={item.code} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-mono font-medium text-navy truncate">
                  snip/{item.code}
                </p>
                <p className="text-xs text-text-muted truncate">{item.original_url}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <CopyButton text={item.short_url} />
                <Link
                  href={`/dashboard/${item.code}`}
                  className="inline-flex items-center justify-center rounded-md border border-input px-2.5 py-1.5 text-xs hover:bg-surface transition-colors"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-mint" />
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
