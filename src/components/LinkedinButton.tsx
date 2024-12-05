import { Button } from "../components/ui/button";
import { Linkedin } from "lucide-react";

export default function LinkedinButton({
  linkedinUrl,
}: {
  linkedinUrl: string;
}) {
  const openLinkedin = () => {
    window.open("https://www.linkedin.com/in/" + linkedinUrl);
  };
  return (
    <Button className="bg-[#0a66c2] p-5 w-full" onClick={openLinkedin}>
      <span className="text-white">Ver LinkedIn</span>
      <Linkedin className="text-white h-auto" />
    </Button>
  );
}
