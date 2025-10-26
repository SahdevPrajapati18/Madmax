# Supabase Configuration Setup Guide

## 1. Environment Variables (.env)

Your current `.env` file shows:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_API_KEY=your_supabase_anon_key
```

**How to get these values:**
1. Go to your Supabase project dashboard
2. Go to Settings → API
3. Copy the "Project URL" and "anon public" key

## 2. Supabase Storage Setup

### Create Storage Bucket:
1. In your Supabase dashboard, go to Storage
2. Create a new bucket named `music-files` (or `music` if you prefer)
3. Set it as private (not public)

### Configure RLS Policies:
Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create storage.objects policies for 'music-files' bucket
CREATE POLICY "Users can upload music files" ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'music-files');

CREATE POLICY "Users can view music files" ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'music-files');

CREATE POLICY "Users can update music files" ON storage.objects
FOR UPDATE
TO anon
USING (bucket_id = 'music-files')
WITH CHECK (bucket_id = 'music-files');

CREATE POLICY "Users can delete music files" ON storage.objects
FOR DELETE
TO anon
USING (bucket_id = 'music-files');
```

**Note:** Make sure you're using the **anon** key, not the **service_role** key. The service_role key bypasses RLS, but the anon key respects it.

## 3. Testing Your Setup

1. **Check if your environment variables are correct:**
   - Verify SUPABASE_URL ends with `supabase.co`
   - Verify SUPABASE_API_KEY starts with `eyJ`

2. **Test storage connection:**
   Run your application and check the console logs. You should see:
   - `🔄 Uploading file to Supabase: timestamp-randomstring.ext`
   - `✅ File uploaded successfully: timestamp-randomstring.ext`

3. **If you still get "row violates row-level security policy":**
   - Double-check your RLS policies match your bucket name exactly
   - Ensure you're using the "anon" key, not the "service_role" key
   - Check if your Supabase project is active

## 4. Troubleshooting

### "Row-level security policy" errors:
- Your RLS policies are too restrictive
- Use the SQL policies provided above
- Make sure you're using the anon key, not service role key

### "Object not found" errors:
- Files were uploaded but not found during URL generation
- Check if the bucket name in your code matches exactly (`music-files`)
- Verify RLS policies allow the anon key to read objects

### Still having issues?
Run this test in your Supabase SQL Editor to verify your setup:
```sql
-- Check if your bucket exists
SELECT name FROM storage.buckets WHERE name = 'music-files';

-- Check your current policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```
