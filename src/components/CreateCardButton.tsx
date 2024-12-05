import { Button } from "./ui/button";

export default function CreateCardButton() {
  const handleCreateCard = async () => {
    console.log("create card");
    // redirect to contacto/crear
    window.location.href = "/contacto/crear";
  };
  return (
    <Button
      className="w-full bg-slate-500 text-white/80 font-medium"
      onClick={handleCreateCard}
    >
      Crear mi tarjeta 🚀✨
    </Button>
  );
}
