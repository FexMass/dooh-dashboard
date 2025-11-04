import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import api from "@/services/api";
import { type Ad } from "@/types";
import AdUploadDialog from "@/components/components_nonshad/ads/AdUploadDialog";
import AdRow from "@/components/components_nonshad/ads/AdRow";

export default function Ads() {
  const [uploadOpen, setUploadOpen] = useState(false);

  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; ads: Ad[] }>("/api/ads");
      return res.data.ads;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Loading ads...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advertisements</h1>
          <p className="text-gray-500 mt-1">Manage your video and image ads</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Ad
        </Button>
      </div>

      {!ads || ads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No ads yet</p>
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Upload Your First Ad
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ads.map((ad) => (
                <AdRow key={ad.id} ad={ad} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AdUploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
