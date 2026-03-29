import { Request, Response } from "express";
import { supabase, BUCKET_NAME } from "../../utils/supabase";
import { v4 as uuidv4 } from "uuid";

export const uploadController = {
  uploadImage: async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No se ha proporcionado ningún archivo" });
        return;
      }

      const file = req.file;
      const folder = req.body.folder || "others"; // teams, players, etc.
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error("Error subiendo a Supabase Storage:", error);
        res.status(500).json({ error: "Error subiendo archivo a Supabase" });
        return;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      res.status(200).json({
        url: publicUrl,
        path: data.path,
      });
    } catch (error) {
      console.error("Internal Server Error en uploadImage:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
