"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardCharts({
  enquiryData,
}: {
  enquiryData: { status: string; count: number }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enquiries by status</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {enquiryData.length === 0 ? (
          <p className="text-sm text-slate-500">No enquiry data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={enquiryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#174A83" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
