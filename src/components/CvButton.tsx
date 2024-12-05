// CvButton.tsx
import { Button } from "../components/ui/button";
import { FileBadge } from "lucide-react";
import { actions } from "astro:actions";
import { useState } from "react";

export default function CvButton({ fileKey }: { fileKey: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { data, error } = await actions.getFileUrl({ key: fileKey });
      if (error) {
        console.error("Error getting CV:", error);
        return;
      }
      if (data?.url) {
        window.open(data.url);
      }
    } catch (err) {
      console.error("Failed to get CV:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="bg-gray-600 p-5 w-full"
      onClick={handleClick}
      disabled={loading}
    >
      <span className="text-white">{loading ? "Cargando..." : "Ver CV"}</span>
      <FileBadge className="text-white h-auto" />
    </Button>
  );
}
