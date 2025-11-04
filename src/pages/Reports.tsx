import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Eye, Zap, QrCode, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import api from "@/services/api";
import { type Device, type Ad } from "@/types";
import DateRangePicker from "@/components/components_nonshad/reports/DateRangePicker";
import ViewsChart from "@/components/components_nonshad/reports/ViewsChart";

interface ReportStats {
  totalViews: number;
  totalChargingEvents: number;
  totalQRScans: number;
  avgViewsPerDay: number;
  topLocations: Array<{ locationName: string; views: number }>;
  topAds: Array<{ adName: string; views: number }>;
  viewsByDate: Array<{ date: string; views: number }>;
}

export default function Reports() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [selectedAd, setSelectedAd] = useState<string>("all");

  const { data: devices } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; devices: Device[] }>(
        "/api/devices"
      );
      return res.data.devices;
    },
  });

  const { data: ads } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; ads: Ad[] }>("/api/ads");
      return res.data.ads;
    },
  });

  // Mock data for now - will implement real endpoint later
  const stats: ReportStats = {
    totalViews: 1247,
    totalChargingEvents: 89,
    totalQRScans: 34,
    avgViewsPerDay: 42,
    topLocations: [
      { locationName: "Cafe Central", views: 324 },
      { locationName: "Hotel Plaza", views: 289 },
      { locationName: "Mall Entrance", views: 198 },
    ],
    topAds: [
      { adName: "Coca Cola Winter", views: 456 },
      { adName: "Nike Sportswear", views: 342 },
      { adName: "Samsung Galaxy", views: 234 },
    ],
    viewsByDate: [
      { date: "11/01", views: 45 },
      { date: "11/02", views: 52 },
      { date: "11/03", views: 38 },
      { date: "11/04", views: 61 },
    ],
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());

      const response = await api.get(
        `/api/reports/export/csv?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `dooh-report-${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">Analytics and insights</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <Select value={selectedDevice} onValueChange={setSelectedDevice}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Devices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Devices</SelectItem>
              {devices?.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedAd} onValueChange={setSelectedAd}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Ads" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ads</SelectItem>
              {ads?.map((ad) => (
                <SelectItem key={ad.id} value={ad.id}>
                  {ad.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Charging Events
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalChargingEvents.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalQRScans.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Views/Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgViewsPerDay}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <ViewsChart data={stats.viewsByDate} />

      {/* Top Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Top Locations</h3>
          <div className="space-y-3">
            {stats.topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{location.locationName}</span>
                <span className="font-semibold">
                  {location.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Top Ads</h3>
          <div className="space-y-3">
            {stats.topAds.map((ad, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{ad.adName}</span>
                <span className="font-semibold">
                  {ad.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
