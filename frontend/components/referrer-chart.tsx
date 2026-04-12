"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface ReferrerChartProps {
  data: { referrer: string; clicks: number }[];
}

export function ReferrerChart({ data }: ReferrerChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-deep">
          Referrer Sources
        </h3>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-text-muted">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" barCategoryGap="20%">
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#8896A6" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="referrer"
                width={100}
                tick={{ fontSize: 11, fill: "#4A5568" }}
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
              />
              <Bar dataKey="clicks" fill="#00C9A7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
