import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";
import { type Device } from "@/types";
import DeviceCard from "@/components/components_nonshad/devices/DeviceCard";
import AssignAdsDialog from "@/components/components_nonshad/ads/AssignAdsDialog";

export default function Devices() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const { data: devices, isLoading } = useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; devices: Device[] }>(
        "/api/devices"
      );
      return res.data.devices;
    },
  });

  const handleAssignAds = (device: Device) => {
    setSelectedDevice(device);
    setAssignDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading devices...</div>
      </div>
    );
  }

  const onlineDevices = devices?.filter((d) => d.status === "online") || [];
  const offlineDevices = devices?.filter((d) => d.status === "offline") || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Devices</h1>
        <p className="text-gray-500 mt-1">
          {devices?.length || 0} total devices · {onlineDevices.length} online
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({devices?.length || 0})</TabsTrigger>
          <TabsTrigger value="online">
            Online ({onlineDevices.length})
          </TabsTrigger>
          <TabsTrigger value="offline">
            Offline ({offlineDevices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {!devices || devices.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No devices registered yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onAssignAds={handleAssignAds}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="online" className="mt-6">
          {onlineDevices.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No online devices</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onlineDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onAssignAds={handleAssignAds}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="offline" className="mt-6">
          {offlineDevices.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">No offline devices</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offlineDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onAssignAds={handleAssignAds}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AssignAdsDialog
        open={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedDevice(null);
        }}
        device={selectedDevice}
      />
    </div>
  );
}
