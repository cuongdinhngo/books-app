export const useBaseModel = (tableName: string) => {
  const supabase = useSupabaseClient();
  const imageStorage = useImageStorage('books');

  class BaseModel {
    protected tableName: string;
    protected model: any;
    protected photoStorage: any;

    constructor() {
      this.tableName = tableName;
      this.model = supabase.from(tableName);
      this.photoStorage = imageStorage;
    }

    async upsert(data: any) {
      try {
        const { data: result, error } = await this.model.upsert(data).select();
        if (error) throw error;

        return result;
      } catch (err) {
        console.error(`[ERROR] upsert ${this.tableName}:`, err);
        return null;
      }
    }

    async processData(data: any) {
      const uploadedPhoto = await this.photoStorage.upload(data.photo, 'authors');
      if (uploadedPhoto) {
        data.photo = uploadedPhoto;
      }
      return await this.upsert(
        this.transform(data)
      );
    }

    transform(data: any) {
      return data;
    }
  }

  return new BaseModel();
};