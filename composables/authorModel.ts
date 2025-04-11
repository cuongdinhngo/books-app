export const useAuthorModel = () => {
  const baseModel = useBaseModel('authors');

  interface Author {
    id?: Number | null,
    fullName?: String | null,
    photo?: String | null,
    birthYear?: Number | null,
    deathYear?: Number | null
  }

  class AuthorsModel extends baseModel.constructor {

    async getAuthorsWithBooks() {
      try {
        const { data, error } = await this.model.select('*, books(*)');
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[ERROR] getAuthorsWithBooks:', err);
        return null;
      }
    }

    transform(author: Author) {
      let data = {
        full_name: author.fullName,
        birth_year: author.birthYear,
        death_year: author.deathYear
      }
      if (typeof author.id === "number") {
        data = {
          ...data,
          id: author.id as Number
        };
      }

      if (typeof author.photo === "string") {
        data = {
          ...data,
          photo: author.photo as String
        };
      }

      return data;
    }
  }

  return new AuthorsModel();
};