import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useState } from "react";

import { actions, isInputError } from "astro:actions";
import { toast, Toaster } from "sonner";

export default function ContactForm({ toEmail }: { toEmail: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Hola, te escribo por si te interesa..."
  );

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!name || !email || !message) {
      setIsSubmitted(false);
      return;
    }

    // call astro action
    const { error } = await actions.sendEmail({
      name,
      email,
      message,
      toEmail,
    });
    if (isInputError(error)) {
      if (error.fields.email) {
        setErrorMessages((prev) => [...prev, "Correo no válido"]);
      }
      if (error.fields.name) {
        setErrorMessages((prev) => [...prev, "Nombre no válido"]);
      }
      if (error.fields.message) {
        setErrorMessages((prev) => [...prev, "Mensaje no válido"]);
      }
      setIsSubmitted(false);
      return toast(errorMessages.join("\n"));
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
        onChange={(e) => setName(e.target.value.trim())}
        required
      />
      <Input
        className="w-full"
        placeholder="Tu correo"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value.trim())}
        required
      />
      <Input
        className="w-full"
        placeholder="Tu mensaje"
        type="text"
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value.trim())}
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
