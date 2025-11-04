import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { type Device, type Ad } from "@/types";
import api from "@/services/api";

interface AssignAdsDialogProps {
  open: boolean;
  onClose: () => void;
  device: Device | null;
}

interface AdAssignment {
  adId: string;
  screen: number;
  priority: string;
}

export default function AssignAdsDialog({
  open,
  onClose,
  device,
}: AssignAdsDialogProps) {
  const [screen0Ads, setScreen0Ads] = useState<string[]>([]);
  const [screen1Ads, setScreen1Ads] = useState<string[]>([]);
  const [premiumAdId, setPremiumAdId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: ads } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; ads: Ad[] }>("/api/ads");
      return res.data.ads;
    },
    enabled: open,
  });

  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!device) return;

      const assignments: AdAssignment[] = [
        ...screen0Ads.map((adId) => ({
          adId,
          screen: 0,
          priority: adId === premiumAdId ? "premium" : "normal",
        })),
        ...screen1Ads.map((adId) => ({
          adId,
          screen: 1,
          priority: adId === premiumAdId ? "premium" : "normal",
        })),
      ];

      await api.post(`/api/devices/${device.id}/assign`, { ads: assignments });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
      handleClose();
    },
  });

  const handleClose = () => {
    setScreen0Ads([]);
    setScreen1Ads([]);
    setPremiumAdId("");
    onClose();
  };

  const toggleAd = (adId: string, screen: number) => {
    if (screen === 0) {
      setScreen0Ads((prev) =>
        prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
      );
    } else {
      setScreen1Ads((prev) =>
        prev.includes(adId) ? prev.filter((id) => id !== adId) : [...prev, adId]
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Ads to {device?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Screen 0 (Top) */}
          <div>
            <h3 className="font-semibold mb-3">Screen 0 (Top)</h3>
            <div className="space-y-2 border rounded-lg p-4">
              {ads?.map((ad) => (
                <div
                  key={`screen0-${ad.id}`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={screen0Ads.includes(ad.id)}
                    onCheckedChange={() => toggleAd(ad.id, 0)}
                  />
                  <label className="text-sm flex-1 cursor-pointer">
                    {ad.name} ({ad.duration}s)
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Screen 1 (Bottom) */}
          <div>
            <h3 className="font-semibold mb-3">Screen 1 (Bottom)</h3>
            <div className="space-y-2 border rounded-lg p-4">
              {ads?.map((ad) => (
                <div
                  key={`screen1-${ad.id}`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    checked={screen1Ads.includes(ad.id)}
                    onCheckedChange={() => toggleAd(ad.id, 1)}
                  />
                  <label className="text-sm flex-1 cursor-pointer">
                    {ad.name} ({ad.duration}s)
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Ad */}
          <div>
            <h3 className="font-semibold mb-3">Premium Ad (Charging)</h3>
            <Select value={premiumAdId} onValueChange={setPremiumAdId}>
              <SelectTrigger>
                <SelectValue placeholder="Select premium ad..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {ads?.map((ad) => (
                  <SelectItem key={ad.id} value={ad.id}>
                    {ad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Shown when phone plugged in for charging
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => assignMutation.mutate()}
              disabled={assignMutation.isPending}
              className="flex-1"
            >
              {assignMutation.isPending ? "Assigning..." : "Assign Ads"}
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
