export const useSubmit = () => {
  const loading = ref(false);

  const submit = async(funcs: (() => any) | Array<() => any>) => {
    loading.value = true;
    try {
      if (Array.isArray(funcs)) {
        await Promise.all(funcs.map(fn => fn()));
      } else {
        await funcs();
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    submit,
  };
}