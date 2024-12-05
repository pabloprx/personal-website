import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { sendEmail } from "../lib/services/email";
import { R2Service } from "../lib/services/storage";

export const server = {
  sendEmail: defineAction({
    input: z.object({
      name: z.string().max(100),
      email: z.string().email(),
      message: z.string().max(1000),
      toEmail: z.string().email(),
    }),
    handler: async ({ name, email, message, toEmail }) => {
      console.log("Sending email...");
      console.log(name, email, message);
      try {
        const res = await sendEmail({ name, email, message, toEmail });
        return res.data;
      } catch (error) {
        console.error(error);
        return { error: "Error al enviar el correo" };
      }
    },
  }),

  uploadFile: defineAction({
    accept: "form",
    handler: async (formData: FormData) => {
      console.log("Uploading file...");
      try {
        const file = formData.get("file") as File;
        const name = file.name;

        if (!file) {
          throw new Error("File missing");
        }

        console.log("File details:", {
          name: file.name,
          type: file.type,
          size: file.size,
        });

        const r2 = new R2Service();
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Attempting to upload file:", {
          bufferSize: buffer.length,
          filename: name,
        });

        const result = await r2.uploadFile(buffer, name);
        console.log("Upload successful:", result);
        return result;
      } catch (error) {
        console.error("Upload error:", {
          message: error.message,
          code: error.code,
          stack: error.stack,
        });

        throw new ActionError({
          code: "UPLOAD_FAILED",
          message: `Error al subir el archivo: ${error.message}`,
        });
      }
    },
  }),

  getFileUrl: defineAction({
    input: z.object({
      key: z.string(),
    }),
    handler: async ({ key }) => {
      try {
        const r2 = new R2Service();
        const url = await r2.getSignedUrl(key);
        return { url };
      } catch (error) {
        throw new ActionError({
          code: "FILE_NOT_FOUND",
          message: "Error al obtener el archivo",
        });
      }
    },
  }),
};
