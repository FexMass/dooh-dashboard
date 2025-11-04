export interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Ad {
  id: string;
  name: string;
  type: "video" | "image";
  url: string;
  duration: number;
  clientName?: string;
  fileSize?: number;
  createdAt: string;
}

export interface Device {
  id: string;
  deviceId: string;
  name: string;
  locationName: string;
  locationAddress?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  status: "online" | "offline";
  lastSeen: string;
  batteryLevel?: number;
  androidVersion?: string;
  registeredAt: string;
}

export interface Stat {
  id: string;
  deviceId: string;
  adId: string;
  eventType: "view" | "charging_start" | "charging_end" | "qr_scan";
  screen: number;
  timestamp: string;
  duration?: number;
  rotationSlot?: number;
}

export interface DashboardStats {
  views: {
    today: number;
    week: number;
    month: number;
  };
  devices: {
    active: number;
    total: number;
  };
  topLocations: Array<{
    deviceId: string;
    locationName: string;
    views: number;
  }>;
  topAds: Array<{
    adId: string;
    name: string;
    views: number;
  }>;
  chargingEvents: number;
  qrScans: number;
}
