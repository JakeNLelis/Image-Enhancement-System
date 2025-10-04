"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { MembershipFunctionChartProps } from "@/types/fuzzy";

export function MembershipFunctionChart({
  data,
  height = 300,
}: MembershipFunctionChartProps) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

  const chartData =
    data.functions[0]?.points?.map((point, index) => {
      const dataPoint: Record<string, number> = { x: point.x };

      data.functions.forEach((func) => {
        if (func.points[index]) {
          dataPoint[func.name] = func.points[index].y;
        }
      });

      return dataPoint;
    }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {data.variable.charAt(0).toUpperCase() + data.variable.slice(1)}{" "}
          Membership Functions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                type="number"
                scale="linear"
                domain={data.universe}
              />
              <YAxis domain={[0, 1]} />

              {data.currentValue !== undefined && (
                <ReferenceLine
                  x={data.currentValue}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{
                    value: `Current: ${data.currentValue.toFixed(1)}`,
                    position: "top",
                  }}
                />
              )}

              {data.functions.map((func, index) => (
                <Line
                  key={func.name}
                  type="linear"
                  dataKey={func.name}
                  stroke={func.color || colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {data.functions.map((func, index) => (
            <div key={func.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: func.color || colors[index % colors.length],
                }}
              />
              <span className="text-sm">{func.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
