"use client";

import { MousePointerClick, Globe, Monitor, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AnalyticsResponse } from "@/lib/types";

interface StatsCardsProps {
  data: AnalyticsResponse;
}

export function StatsCards({ data }: StatsCardsProps) {
  const topCountry = data.countries[0]?.country || "—";
  const topBrowser = data.browsers[0]?.browser || "—";
  const topReferrer = data.referrers[0]?.referrer || "—";

  const stats = [
    {
      label: "Total Clicks",
      value: data.total_clicks.toLocaleString(),
      icon: MousePointerClick,
      color: "text-navy",
      bg: "bg-navy/10",
    },
    {
      label: "Countries",
      value: data.countries.length.toString(),
      sub: topCountry !== "—" ? `Top: ${topCountry}` : undefined,
      icon: Globe,
      color: "text-mint-dark",
      bg: "bg-mint/10",
    },
    {
      label: "Top Browser",
      value: topBrowser,
      icon: Monitor,
      color: "text-navy-light",
      bg: "bg-navy/10",
    },
    {
      label: "Top Referrer",
      value: topReferrer,
      icon: ArrowUpRight,
      color: "text-coral",
      bg: "bg-coral/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="flex items-start gap-3 pt-5">
            <div className={`rounded-lg p-2 ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted">{stat.label}</p>
              <p className="text-lg font-heading font-bold text-deep dark:text-white">{stat.value}</p>
              {stat.sub && (
                <p className="text-xs text-text-muted">{stat.sub}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
