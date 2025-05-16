import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

/**
 * Clinician dashboard – aggregate cohort metrics.
 * Expects backend route `/admin/metrics` returning:
 *   {
 *     kcal7d:       [{ date: "2025-05-10", kcal: 1890 }, ...],
 *     sentiment7d:  [{ date: "2025-05-10", score: 0.18 }, ...]
 *   }
 */
const Dashboard = () => {
  const [kcalData, setKcalData] = useState([]);
  const [sentimentData, setSentimentData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/admin/metrics");
        const data = await res.json();
        setKcalData(data.kcal7d ?? []);
        setSentimentData(data.sentiment7d ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Clinician Dashboard</h1>

      <Tabs defaultValue="kcal">
        <TabsList>
          <TabsTrigger value="kcal">Avg Calories</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="kcal">
          <Card>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={kcalData}
                  margin={{ left: 8, right: 8, top: 16, bottom: 0 }}
                >
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="kcal"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment">
          <Card>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sentimentData}
                  margin={{ left: 8, right: 8, top: 16, bottom: 0 }}
                >
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[-1, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;