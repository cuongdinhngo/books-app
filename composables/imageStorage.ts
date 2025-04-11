export const useImageStorage = (bucketName: string) => {
  const supabase = useSupabaseClient();

  class ImageStorage {
    protected bucketName: string;
    protected storage: any;

    constructor() {
      this.bucketName = bucketName;
      this.storage = supabase.storage.from(this.bucketName);
    }

    async upload(image: any, directory: string | "public") {
      let publicUrl = null;
      if (image) {
        const imageExt = image.name.split('.').pop();
        const imageName = `${generateUUID()}.${imageExt}`;
        const imagePath = `${directory}/${imageName}`;
  
        try {
          const { error: storageError } = await this.storage.upload(imagePath, image);
          if (storageError) throw storageError;
  
          publicUrl = await this.generatePublicUrl(imagePath);
        } catch(err) {
          console.log('[ERROR] upload: ', err);
        }
      }
  
      return publicUrl;
    }

    async generatePublicUrl(imagePath: string) {
      try {
        const { data, error } = await this.storage.getPublicUrl(imagePath);
        if (error) throw error;
  
        return data.publicUrl;
      } catch(err) {
        console.log('[ERROR] generatePublicUrl: ', err);
        return null;
      }
    }
  }

  return new ImageStorage();
}