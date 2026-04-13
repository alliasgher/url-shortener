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
import { useDarkMode, chartColors } from "@/lib/use-dark-mode";

interface GeoChartProps {
  data: { country: string; clicks: number }[];
}

export function GeoChart({ data }: GeoChartProps) {
  const dark = useDarkMode();
  const c = dark ? chartColors.dark : chartColors.light;

  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-deep dark:text-white">
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
                tick={{ fontSize: 11, fill: c.tick }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="country"
                width={40}
                tick={{ fontSize: 12, fill: c.text, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: c.tooltipBg,
                  border: `1px solid ${c.tooltipBorder}`,
                  borderRadius: 8,
                  fontSize: 12,
                  color: c.text,
                }}
              />
              <Bar dataKey="clicks" fill={dark ? "#00C9A7" : "#1E3A5F"} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
