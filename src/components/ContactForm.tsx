import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useState } from "react";

import { actions } from "astro:actions";
import { toast, Toaster } from "sonner";

export default function ContactForm({ toEmail }: { toEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Hola, te escribo por si te interesa..."
  );

  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();

    if (!name || !email || !message) {
      setIsSubmitted(false);
      return;
    }

    // call astro action
    const result = await actions.sendEmail({
      name,
      email,
      message,
      toEmail,
    });
    if (result.error) {
      console.error(result.error);
      return toast("Algo salió mal");
    }
    toast("Mensaje enviado :)");
    resetForm();
  };
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <Input
        className="w-full"
        placeholder="Tu nombre"
        type="text"
        name="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        className="w-full"
        placeholder="Tu correo"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        className="w-full"
        placeholder="Tu mensaje"
        type="text"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="w-full mt-4">
        <Button
          className="bg-white/80 w-full"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          Enviar
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
