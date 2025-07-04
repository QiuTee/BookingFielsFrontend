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


export const uploadFieldImage = async (file , fieldId) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `field-images/${fieldId}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('field-images')
    .upload(filePath, file);

  if (error) {
    console.error("Upload failed:", error.message);
    throw error;
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('field-images')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

export const uploadProductImage = async (file, productId) => {
  const fileExt = file.name.split('.').pop();
  const filePath = `product-image/${productId}_${Date.now()}.${fileExt}`;

  const {data, error} = await supabase.storage
    .from('product-image')
    .upload(filePath, file);

  if (error) {
    console.error("Upload failed:", error.message);
    throw error;
  }

  const { data: publicUrlData } = supabase
    .storage
    .from('product-image')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}