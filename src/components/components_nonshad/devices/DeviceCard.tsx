import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Monitor, MapPin, Battery, Wifi, WifiOff } from "lucide-react";
import { type Device } from "@/types";

interface DeviceCardProps {
  device: Device;
  onAssignAds: (device: Device) => void;
}

export default function DeviceCard({ device, onAssignAds }: DeviceCardProps) {
  const isOnline = device.status === "online";
  const lastSeenMinutes = Math.floor(
    (Date.now() - new Date(device.lastSeen).getTime()) / 60000
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="font-semibold">{device.name}</h3>
              <p className="text-sm text-gray-500">{device.deviceId}</p>
            </div>
          </div>
          <Badge variant={isOnline ? "default" : "secondary"}>
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 mr-1" /> Online
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 mr-1" /> Offline
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{device.locationName}</span>
        </div>

        {device.batteryLevel !== null && device.batteryLevel !== undefined && (
          <div className="flex items-center gap-2 text-gray-600">
            <Battery className="w-4 h-4" />
            <span>{device.batteryLevel}%</span>
            {device.batteryLevel < 15 && (
              <Badge variant="destructive" className="ml-2">
                Low
              </Badge>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Last seen:{" "}
          {lastSeenMinutes < 1 ? "Just now" : `${lastSeenMinutes}m ago`}
        </div>

        {device.gpsLatitude && device.gpsLongitude && (
          <div className="text-xs text-gray-500">
            GPS: {device.gpsLatitude.toFixed(4)},{" "}
            {device.gpsLongitude.toFixed(4)}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onAssignAds(device)}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Assign Ads
        </Button>
      </CardFooter>
    </Card>
  );
}
