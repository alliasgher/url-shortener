"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface ClicksChartProps {
  data: { date: string; clicks: number }[];
}

export function ClicksChart({ data }: ClicksChartProps) {
  // Fill missing dates in the last 30 days
  const filled = fillDates(data);

  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-deep">
          Clicks Over Time
        </h3>
        {filled.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-text-muted">
            No clicks yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={filled}>
              <defs>
                <linearGradient id="clickGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E8EF" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => {
                  const date = new Date(d);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
                tick={{ fontSize: 11, fill: "#8896A6" }}
                axisLine={{ stroke: "#E3E8EF" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#8896A6" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E3E8EF",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(d) => new Date(d).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#00C9A7"
                strokeWidth={2}
                fill="url(#clickGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

function fillDates(data: { date: string; clicks: number }[]): { date: string; clicks: number }[] {
  if (data.length === 0) return [];

  const map = new Map(data.map((d) => [d.date.split("T")[0], d.clicks]));
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 29);

  const result: { date: string; clicks: number }[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    result.push({ date: key, clicks: map.get(key) || 0 });
  }
  return result;
}
