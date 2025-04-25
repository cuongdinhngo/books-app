export const useBookCarts = () => {
  const bookCart = useCookie<number[]>(
    'bookCart',
    {
      default: () => [],
      watch: true
    }
  );

  const addToCart = (bookId: number) => {
    if (!bookCart.value.includes(bookId)) {
      bookCart.value.push(bookId);
    }
  }

  const removeCartItem = (bookId: number) => {
    bookCart.value = bookCart.value.filter(item => item !== bookId);
  }

  const reset = () => {
    bookCart.value = [];
  }

  return {
    bookCart,
    addToCart,
    removeCartItem,
    reset
  }
}