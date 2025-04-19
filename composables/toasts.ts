export const useToastError = (e: any) => {
  console.error('[ERROR] => ', e)
  useToast().add({
    title: 'Error',
    description: 'This action failed. Please try again.',
    color: 'error'
  })
}

export const useToastSuccess = (e: any = null) => {
  useToast().add({
    title: 'Success',
    description: 'This action is completed successfully!',
    color: 'success'
  })
}