"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { RecentClick } from "@/lib/types";

interface RecentClicksTableProps {
  clicks: RecentClick[];
}

export function RecentClicksTable({ clicks }: RecentClicksTableProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-deep">
          Recent Clicks
        </h3>
        {clicks.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            No clicks recorded yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-xs text-text-muted">Time</TableHead>
                  <TableHead className="text-xs text-text-muted">Country</TableHead>
                  <TableHead className="text-xs text-text-muted hidden sm:table-cell">City</TableHead>
                  <TableHead className="text-xs text-text-muted">Browser</TableHead>
                  <TableHead className="text-xs text-text-muted hidden md:table-cell">OS</TableHead>
                  <TableHead className="text-xs text-text-muted">Device</TableHead>
                  <TableHead className="text-xs text-text-muted hidden md:table-cell">Referrer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clicks.map((click, i) => (
                  <TableRow key={i} className="border-border">
                    <TableCell className="text-xs text-text-secondary whitespace-nowrap">
                      {formatRelativeTime(click.clicked_at)}
                    </TableCell>
                    <TableCell className="text-xs font-medium">
                      {click.country || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary hidden sm:table-cell">
                      {click.city || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">
                      {click.browser || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary hidden md:table-cell">
                      {click.os || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] capitalize bg-surface text-text-secondary">
                        {click.device_type || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-text-muted hidden md:table-cell">
                      {click.referrer || "Direct"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
