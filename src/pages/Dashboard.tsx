import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { DashboardStats } from "@/types";
import { Users, Eye, Zap, Monitor } from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; stats: DashboardStats }>(
        "/api/reports/dashboard"
      );
      return res.data.stats;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: "Views Today",
      value: stats.views.today.toLocaleString(),
      icon: Eye,
      color: "blue",
    },
    {
      label: "Views This Week",
      value: stats.views.week.toLocaleString(),
      icon: Eye,
      color: "indigo",
    },
    {
      label: "Active Devices",
      value: `${stats.devices.active} / ${stats.devices.total}`,
      icon: Monitor,
      color: "green",
    },
    {
      label: "Charging Events",
      value: stats.chargingEvents.toLocaleString(),
      icon: Zap,
      color: "yellow",
    },
    {
      label: "QR Scans",
      value: stats.qrScans.toLocaleString(),
      icon: Users,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your DOOH network</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Locations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Locations</h2>
        <div className="space-y-3">
          {stats.topLocations.length > 0 ? (
            stats.topLocations.map((location) => (
              <div
                key={location.deviceId}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{location.locationName}</span>
                <span className="text-gray-900 font-semibold">
                  {location.views.toLocaleString()} views
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Top Ads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Ads</h2>
        <div className="space-y-3">
          {stats.topAds.length > 0 ? (
            stats.topAds.map((ad) => (
              <div
                key={ad.adId}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <span className="text-gray-700">{ad.name}</span>
                <span className="text-gray-900 font-semibold">
                  {ad.views.toLocaleString()} views
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No ads yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
