const TABLE_NAME = 'book_photos';

const { insert:insertBatch, get, remove, update } = useCrud(TABLE_NAME);

export const useBookPhotos = () => {
  const { uploadPhoto } = useImages('books');

  const insert = async(photos: File[], bookId: number) => {
    let insertData = [];
    for (const photo of photos) {
      const imageUrl = await uploadPhoto(photo, 'books');
      if (imageUrl) {
        insertData.push({
          book_id: bookId,
          image_url: imageUrl
        });
      }
    }

    return insertBatch(insertData);
  }

  return {
    insert,
    get,
    remove,
    update
  }
}