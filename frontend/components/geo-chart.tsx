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

interface GeoChartProps {
  data: { country: string; clicks: number }[];
}

export function GeoChart({ data }: GeoChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-deep">
          Top Countries
        </h3>
        {data.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-text-muted">
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
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
                dataKey="country"
                width={40}
                tick={{ fontSize: 12, fill: "#0D1B2A", fontWeight: 500 }}
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
              <Bar dataKey="clicks" fill="#1E3A5F" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
