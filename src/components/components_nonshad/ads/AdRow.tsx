import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { MoreVertical, Trash2, Eye } from "lucide-react";
import { type Ad } from "@/types";
import api from "@/services/api";

interface AdRowProps {
  ad: Ad;
}

export default function AdRow({ ad }: AdRowProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/api/ads/${ad.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });

  const handleDelete = () => {
    if (confirm(`Delete "${ad.name}"?`)) {
      deleteMutation.mutate();
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{ad.name}</TableCell>
      <TableCell>{ad.clientName || "-"}</TableCell>
      <TableCell>
        <Badge variant={ad.type === "video" ? "default" : "secondary"}>
          {ad.type}
        </Badge>
      </TableCell>
      <TableCell>{ad.duration}s</TableCell>
      <TableCell>
        {ad.fileSize ? `${(ad.fileSize / 1024 / 1024).toFixed(2)} MB` : "-"}
      </TableCell>
      <TableCell>{new Date(ad.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => window.open(ad.url, "_blank")}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
