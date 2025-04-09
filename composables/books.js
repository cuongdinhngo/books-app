export const useBooks = () => {
  const { apiPath } = useSettings();
  const books = useState('books', () => []);
  const perPage = useState('perPage', () => null);
  const totalPages = useState('totalPages', () => null);
  const totalBooks = useState('totalBooks', () => null);
  const currentPage = useState('currentPage', () => null);
  const { token } = useAuth();

  const getAllBooks = async(page, formData = null) => {
    try {
      const response = await $fetch(`${apiPath}/books`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        params: {page: page},
        body: formData
      });

      books.value = response.data;
      totalPages.value = response.last_page;
      perPage.value = response.per_page;
      totalBooks.value = response.total;
    } catch (error) {
      console.log('[ERROR] getAllBooks: ', error);
    }
  }

  return {
    books,
    perPage,
    totalPages,
    totalBooks,
    currentPage,
    getAllBooks,
  }
}