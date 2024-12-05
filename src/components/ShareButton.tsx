import { Link, Share } from "lucide-react";
import { Button } from "./ui/button";
import { toast, Toaster } from "sonner";

export default function ShareButton() {
  const handleShare = async () => {
    console.log("share");
    toast("Copiado al portapapeles");
    navigator.clipboard.writeText(window.location.href);
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
