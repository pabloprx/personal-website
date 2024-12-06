import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useRef, useState } from "react";
import { actions } from "astro:actions";
import { toast, Toaster } from "sonner";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { encodeContactData } from "../lib/urlParams";

export default function CreateForm() {
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [cv, setCv] = useState<File | undefined>(undefined);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [linkedin, setLinkedin] = useState("");
  // const [color, setColor] = useColor("rgb(86 30 203)");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cvInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setOccupation("");
    setEmail("");
    setCv(undefined);
    setLinkedin("");
    // setColor("rgb(86 30 203)");
    setIsSubmitted(false);

    if (cvInputRef.current) {
      cvInputRef.current.value = "";
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const extractNameFromLinkedin = (linkedin: string) => {
    try {
      const linkedinUsername =
        linkedin.split("/")[linkedin.split("/").length - 1];
      return linkedinUsername;
    } catch (error) {
      return linkedin;
    }
  };

  const handleFileUpload = async (
    file: File,
    options: {
      maxSize: number;
      allowedTypes: string[];
      errorMessages: {
        type: string;
        size: string;
      };
    }
  ) => {
    // Check file type
    if (!options.allowedTypes.includes(file.type)) {
      toast.error(options.errorMessages.type);
      return null;
    }

    // Check file size
    if (file.size > options.maxSize) {
      toast.error(options.errorMessages.size);
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data, error } = await actions.uploadFile(formData);

      if (error) {
        toast.error(error.message);
        return null;
      }

      return data;
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Error al subir el archivo");
      return null;
    }
  };

  const handleCvUpload = async (file: File) => {
    return handleFileUpload(file, {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ["application/pdf"],
      errorMessages: {
        type: "Solo se permiten archivos PDF",
        size: "El archivo es demasiado grande. Máximo 50MB",
      },
    });
  };

  const handleImageUpload = async (file: File) => {
    return handleFileUpload(file, {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ["image/jpeg", "image/png", "image/jpg"],
      errorMessages: {
        type: "Solo se permiten archivos de imagen (PNG, JPG, JPEG)",
        size: "La imagen es demasiado grande. Máximo 50MB",
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitted(true);
    e.preventDefault();

    if (!name || !occupation || !email || !linkedin) {
      setIsSubmitted(false);
      return;
    }

    const linkedinUsername = extractNameFromLinkedin(linkedin);

    // Handle file uploads
    let cvUrl = null;
    let imageUrl = null;

    if (cv) {
      const cvResult = await handleCvUpload(cv);
      if (!cvResult) return;
      cvUrl = cvResult.key;
    }

    if (image) {
      const imageResult = await handleImageUpload(image);
      if (!imageResult) return;
      imageUrl = imageResult.key;
    }

    console.log({ cvUrl, imageUrl, linkedinUsername, name, occupation, email });

    const payload = {
      linkedin: linkedinUsername,
      name,
      position: occupation,
      email,
      accentColor: null,
    };
    if (cvUrl) {
      payload.cv = cvUrl;
    }
    if (imageUrl) {
      payload.image = imageUrl;
    }

    const queryParam = encodeContactData({ ...payload });

    resetForm();
    window.location.href = `/contacto${queryParam}`;
  };

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <span className="text-sm font-medium text-start w-full">
        Campos Requeridos
      </span>
      <Input
        className="w-full"
        placeholder="Nombre"
        type="text"
        name="name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        className="w-full"
        placeholder="Ocupación (ej: UX Designer)"
        type="text"
        name="occupation"
        value={occupation}
        onChange={(e) => setOccupation(e.target.value)}
        required
      />
      <Input
        className="w-full"
        placeholder="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        className="w-full"
        placeholder="Linkedin (url completa o nombre de usuario)"
        type="text"
        name="linkedin"
        value={linkedin}
        onChange={(e) => setLinkedin(e.target.value)}
        required
      />
      <div className="border border-t-slate-700 w-full my-3" />
      <span className="text-sm font-medium text-start w-full">
        Campos Opcionales
      </span>
      <div className="flex flex-row gap-2 items-center justify-start w-full px-2">
        <span className="min-w-32">CV </span>
        <Input
          className="w-full"
          type="file"
          accept=".pdf"
          name="cv"
          ref={cvInputRef}
          onChange={(e) => setCv(e.target.files?.[0] || null)}
        />
      </div>
      <div className="flex flex-row gap-2 items-center justify-start w-full px-2">
        <span className="min-w-32">Imagen de perfil </span>
        <Input
          className="w-full"
          type="file"
          accept=".png, .jpg, .jpeg"
          name="image"
          ref={imageInputRef}
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>
      {/* <ColorPicker color={color} onChange={setColor} />; */}
      <div className="w-full mt-4">
        <Button
          className="bg-white/80 w-full"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          Crear tarjeta
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
