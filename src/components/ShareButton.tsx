import { Link, Share } from "lucide-react";
import { Button } from "./ui/button";
import { toast, Toaster } from "sonner";

export default function ShareButton() {
  const handleShare = async () => {
    // Check if Web Share API is supported (iOS and modern browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to clipboard API
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast("Copiado al portapapeles");
      } catch (err) {
        // If clipboard API fails, fallback to execCommand
        const textarea = document.createElement("textarea");
        textarea.value = window.location.href;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          toast("Copiado al portapapeles");
        } catch (err) {
          toast.error("No se pudo copiar al portapapeles");
        }
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <>
      <Button
        className="max-w-10 bg-transparent hover:bg-slate-400"
        onClick={handleShare}
      >
        <Link
          className="text-white"
          style={{ width: "28px", height: "28px" }}
        />
        <Toaster />
      </Button>
    </>
  );
}
