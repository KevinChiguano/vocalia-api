import { Router } from "express";
import multer from "multer";
import { uploadController } from "./upload.controller";

const router = Router();

// Configuración de Multer (en memoria para subir a Supabase)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"));
    }
  },
});

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Sube una imagen a Supabase Storage
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 enum: [teams, players, others]
 *     responses:
 *       200:
 *         description: URL de la imagen subida
 *       400:
 *         description: Error en la petición
 */
router.post("/", upload.single("image"), (req, res, next) => {
  uploadController.uploadImage(req, res).catch(next);
});

export default router;
