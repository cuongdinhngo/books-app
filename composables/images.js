export const useImages = (bucketName) => {
  const supabase = useSupabaseClient();
  const bucketModel = useSupabaseClient().storage.from(bucketName);

  const uploadPhoto = async(photo, directory = 'public') => {
    let publicUrl = null;
    if (photo) {
      const photoExt = photo.name.split('.').pop();
      const photoName = `${generateUUID()}.${photoExt}`;
      const photoPath = `${directory}/${photoName}`;

      try {
        const { error: storageError } = await bucketModel.upload(photoPath, photo);
        if (storageError) throw storageError;

        publicUrl = generatePublicUrl(photoPath);
      } catch(err) {
        console.log('[ERROR] uploading photo: ', err);
      }
    }

    return publicUrl;
  }

  const generatePublicUrl = (photoPath) => {
    try {
      const { data, error } = bucketModel.getPublicUrl(photoPath);
      if (error) throw error;

      return data.publicUrl;
    } catch(err) {
      console.log('[ERROR] generatePublicUrl: ', err);
      return null;
    }
  }

  const deletePhoto = (photoPath) => {
    try {
      const { error } = bucketModel.remove([splitPath(photoPath)])
      if (error) throw error;

    } catch(err) {
      console.log('[ERROR] deletePhoto: ', err);
    }
  }

  const splitPath = (fullPath) => {
    return url.split(bucketName)[1];
  }

  return {
    uploadPhoto,
    deletePhoto
  }
}