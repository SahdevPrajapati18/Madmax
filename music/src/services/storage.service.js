import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY); // Must use ANON key for RLS

// ----------------- Upload File -----------------
export async function uploadFile(file) {
  if (!file) throw new Error('No file provided');

  const fileExt = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const bucket = 'music-files';

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(error.message);
  }

  return data.path; // Save this as musicKey / coverImageKey in MongoDB
}

// ----------------- Get Presigned URL -----------------
export async function getPresignedUrl(filePath) {
  if (!filePath) throw new Error('No file path provided');

  const bucket = 'music-files';
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, 60 * 60); // 1 hour expiry

  if (error) {
    console.error('Supabase signed URL error:', error);
    throw new Error(error.message);
  }

  return data.signedUrl;
}
