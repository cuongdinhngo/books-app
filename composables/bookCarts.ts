export const useBookCarts = () => {
  const bookCart = useCookie<number[]>(
    'bookCart',
    {
      default: () => [],
      watch: true
    }
  );

  const addToCart = (bookItemId: number) => {
    if (!bookCart.value.includes(bookItemId)) {
      bookCart.value.push(bookItemId);
    }
  }

  const removeCartItem = (bookItemId: number) => {
    bookCart.value = bookCart.value.filter(item => item !== bookItemId);
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