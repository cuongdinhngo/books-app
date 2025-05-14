export const useWishlistActions = () => {
  const { insert:addToWishlist, index:getWishlists } = useWishlists();
  const { userId } = useAuth();
  const wishlists = ref([]);
  
  const loadWishlists = async () => {
    if (!userId.value) return;
    
    const result = await getWishlists({ readerId: userId.value });
    if (result?.data) {
      wishlists.value = result.data;
    }
    return result;
  };
  
  const isInWishlist = (bookId: number) => {
    return wishlists.value.some(item => item.book_id === bookId);
  };
  
  const addBookToWishlist = async (bookId: number) => {
    if (!userId.value) {
      useToastError('Unauthenticated User', 'Please login to add to wishlist');
      return { success: false };
    }
    
    if (isInWishlist(bookId)) {
      return { success: true };
    }
    
    try {
      const result = await addToWishlist({ reader_id: userId.value, book_id: bookId });
      if (result.error) throw result.error;
      
      wishlists.value.push({ reader_id: userId.value, book_id: bookId });
      useToastSuccess('Book has been added to your wishlist');
      return { success: true };
    } catch (error) {
      useToastError(error);
      return { success: false, error };
    }
  };
  
  return {
    wishlists,
    loadWishlists,
    isInWishlist,
    addBookToWishlist
  };
};
