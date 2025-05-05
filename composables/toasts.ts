export const useToastError = (e: any, errorMessage = 'This action failed. Please try again.') => {
  console.error('[ERROR] => ', e)
  useToast().add({
    title: 'Error',
    description: errorMessage,
    color: 'error'
  })
}

export const useToastSuccess = (successMessage = 'This action is completed successfully!') => {
  useToast().add({
    title: 'Success',
    description: successMessage,
    color: 'success'
  })
}