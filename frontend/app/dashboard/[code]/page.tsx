"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw } from "lucide-react";
import { Header } from "@/components/header";
import { StatsCards } from "@/components/stats-cards";
import { ClicksChart } from "@/components/clicks-chart";
import { GeoChart } from "@/components/geo-chart";
import { DeviceChart } from "@/components/device-chart";
import { ReferrerChart } from "@/components/referrer-chart";
import { RecentClicksTable } from "@/components/recent-clicks-table";
import { CopyButton } from "@/components/copy-button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnalytics } from "@/lib/api";
import type { AnalyticsResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function DashboardPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(() => {
    setRefreshing(true);
    getAnalytics(code)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setRefreshing(false));
  }, [code]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const shortUrl = `${API_URL}/${code}`;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-deep transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-deep transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error ? (
          <div className="rounded-lg border border-coral/30 bg-coral/5 p-8 text-center">
            <p className="text-coral font-medium">{error}</p>
            <Link href="/" className="mt-2 inline-block text-sm text-text-muted hover:text-deep">
              Create a new short link
            </Link>
          </div>
        ) : !data ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Link info banner */}
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono font-medium text-navy truncate hover:underline"
                  >
                    snip/{code}
                  </a>
                  <CopyButton text={shortUrl} />
                </div>
                <p className="text-xs text-text-muted truncate">
                  {data.link.original_url}
                </p>
              </div>
              <a
                href={data.link.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-deep transition-colors shrink-0"
              >
                <ExternalLink className="h-3 w-3" />
                Visit original
              </a>
            </div>

            <StatsCards data={data} />
            <ClicksChart data={data.clicks_over_time} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <GeoChart data={data.countries} />
              <DeviceChart
                browsers={data.browsers}
                os={data.os}
                devices={data.devices}
              />
            </div>

            <ReferrerChart data={data.referrers} />
            <RecentClicksTable clicks={data.recent_clicks} />
          </div>
        )}
      </main>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 w-full rounded-lg" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-[300px] rounded-lg" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    </div>
  );
}
