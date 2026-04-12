"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DeviceChartProps {
  browsers: { browser: string; clicks: number }[];
  os: { os: string; clicks: number }[];
  devices: { device_type: string; clicks: number }[];
}

const COLORS = ["#1E3A5F", "#00C9A7", "#FF6B4A", "#2A4F7A", "#0D8B7D", "#8896A6"];

export function DeviceChart({ browsers, os, devices }: DeviceChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <h3 className="mb-4 font-heading text-sm font-semibold text-deep">
          Device Breakdown
        </h3>
        <Tabs defaultValue="browser">
          <TabsList className="mb-4 bg-surface">
            <TabsTrigger value="browser" className="text-xs data-[state=active]:bg-navy data-[state=active]:text-white">
              Browser
            </TabsTrigger>
            <TabsTrigger value="os" className="text-xs data-[state=active]:bg-navy data-[state=active]:text-white">
              OS
            </TabsTrigger>
            <TabsTrigger value="device" className="text-xs data-[state=active]:bg-navy data-[state=active]:text-white">
              Device
            </TabsTrigger>
          </TabsList>
          <TabsContent value="browser">
            <DonutChart data={browsers.map((b) => ({ name: b.browser, value: b.clicks }))} />
          </TabsContent>
          <TabsContent value="os">
            <DonutChart data={os.map((o) => ({ name: o.os, value: o.clicks }))} />
          </TabsContent>
          <TabsContent value="device">
            <DonutChart data={devices.map((d) => ({ name: d.device_type, value: d.clicks }))} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-text-muted">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#FFFFFF",
            border: "1px solid #E3E8EF",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "#8896A6" }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
