import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Building2,
  TrendingUp,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardStats, getRecentActivities } from "@/lib/db";

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntrepreneurs: 0,
    activeBusinesses: 0,
    averageIncome: 0,
    totalEmployees: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [dashboardStats, activities] = await Promise.all([
          getDashboardStats(),
          getRecentActivities()
        ]);

        setStats({
          totalEntrepreneurs: dashboardStats?.totalEntrepreneurs ?? 0,
          activeBusinesses: dashboardStats?.activeBusinesses ?? 0,
          averageIncome: dashboardStats?.averageIncome ?? 0,
          totalEmployees: dashboardStats?.totalEmployees ?? 0
        });
        setRecentActivities(activities || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statsConfig = [
    {
      title: "Total Entrepreneurs",
      value: stats.totalEntrepreneurs?.toLocaleString() || "0",
      change: "+12.5%",
      increasing: true,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Businesses",
      value: stats.activeBusinesses?.toLocaleString() || "0",
      change: "+8.2%",
      increasing: true,
      icon: Building2,
      color: "bg-green-500",
    },
    {
      title: "Average Income",
      value: `RM ${stats.averageIncome?.toLocaleString() || "0"}`,
      change: "+15.3%",
      increasing: true,
      icon: TrendingUp,
      color: "bg-purple-500",
    },
    {
      title: "Total Employees",
      value: stats.totalEmployees?.toLocaleString() || "0",
      change: "+5.4%",
      increasing: true,
      icon: Briefcase,
      color: "bg-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your entrepreneurs today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <div className={cn("absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10", stat.color)} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", stat.color, "bg-opacity-10")}>
                <stat.icon className={cn("h-5 w-5", stat.color, "text-opacity-100")} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div
                className={cn(
                  "flex items-center text-sm mt-1",
                  stat.increasing ? "text-green-600" : "text-red-600"
                )}
              >
                {stat.increasing ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates and changes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent activities found
              </div>
            ) : (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}