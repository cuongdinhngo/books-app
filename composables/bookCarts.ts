import type { string } from "zod";

export const useBookCarts = () => {
  const { token, readerId } = useReaders();

  const bookCart = useState<Array<Number>>('bookCart', () => []);

  const addToCart = (bookItemId: number) => {
    getBookCartFromStorage();
    if (!bookCart.value.includes(bookItemId)) {
      bookCart.value.push(bookItemId);
    }
    localStorage.setItem(`cart`, JSON.stringify(bookCart.value));
  }

  const getBookCartFromStorage = () => {
    const storagedCart = localStorage.getItem(`cart`);
    let storagedData = storagedCart ? JSON.parse(storagedCart) : [];
    bookCart.value = storagedData.map(item => (Number(item)));
  }

  function storeBookCart() {
    localStorage.setItem(`cart`, JSON.stringify(bookCart.value));
  }

  return {
    bookCart,
    addToCart,
    getBookCartFromStorage,
    storeBookCart
  }
}