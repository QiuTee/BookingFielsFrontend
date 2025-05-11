import { supabase } from "../supabaseClient";

export const uploadImageToSupabase = async (file, bookingId) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `payment_receipts/${bookingId}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('payment-receipts')
    .upload(filePath, file);

  if (error) {
    console.error("Upload failed:", error.message);
    throw error;
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('payment-receipts')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};
