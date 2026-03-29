import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las credenciales de Supabase en el archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BUCKET_NAME = process.env.SUPABASE_BUCKET || "images";

/**
 * Elimina un archivo de Supabase Storage.
 * @param fileUrl URL completa del archivo o path relativo.
 */
export const deleteFile = async (fileUrl: string | null | undefined): Promise<void> => {
  if (!fileUrl) return;

  try {
    // Solo intentar borrar si es una URL de nuestro bucket de Supabase
    if (!fileUrl.includes(supabaseUrl)) return;

    // Extraer el path relativo del archivo
    // La URL suele ser: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path/to/file]
    const searchString = `/storage/v1/object/public/${BUCKET_NAME}/`;
    const pathIndex = fileUrl.indexOf(searchString);
    
    if (pathIndex === -1) return;

    const filePath = fileUrl.substring(pathIndex + searchString.length);

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error(`Error eliminando archivo ${filePath} de Supabase:`, error);
    } else {
      console.log(`Archivo eliminado de Supabase: ${filePath}`);
    }
  } catch (error) {
    console.error("Error en deleteFile:", error);
  }
};
