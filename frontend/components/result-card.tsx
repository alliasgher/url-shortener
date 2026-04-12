"use client";

import Link from "next/link";
import { ExternalLink, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/components/copy-button";
import type { LinkResponse } from "@/lib/types";

interface ResultCardProps {
  link: LinkResponse;
}

export function ResultCard({ link }: ResultCardProps) {
  return (
    <Card className="w-full max-w-xl border-border bg-card">
      <CardContent className="space-y-4 pt-6">
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
            Short URL
          </p>
          <div className="flex items-center gap-2">
            <a
              href={link.short_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-md bg-surface px-3 py-2 text-sm font-mono text-navy font-medium truncate hover:underline"
            >
              snip/{link.code}
            </a>
            <CopyButton text={link.short_url} />
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1">
            Original URL
          </p>
          <p className="text-sm text-text-secondary truncate">{link.original_url}</p>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Link
            href={`/dashboard/${link.code}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mint hover:text-mint-dark transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Link>
          <a
            href={link.short_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-deep transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Test Link
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
