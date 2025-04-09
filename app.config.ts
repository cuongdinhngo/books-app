export default defineAppConfig({
  ui: {
    colors: {
      primary: 'blue',
    },
    pagination: {
      slots: {
        root: '',
        list: 'flex items-center gap-1',
        ellipsis: 'pointer-events-none p-2 bg-primary-300 ring-0 hover:bg-primary-500 disabled:bg-stone-500',
        label: 'min-w-5 text-center',
        first: 'p-2 bg-primary-300 ring-0 hover:bg-primary-500 disabled:bg-stone-500',
        prev: 'p-2 bg-primary-300 ring-0 hover:bg-primary-500 disabled:bg-stone-500',
        item: 'bg-primary-300 ring-0 hover:bg-primary-500',
        next: 'p-2 bg-primary-300 ring-0 hover:bg-primary-500 disabled:bg-stone-500',
        last: 'p-2 bg-primary-300 ring-0 hover:bg-primary-500 disabled:bg-stone-500'
      }
    },
    table: {
      slots: {
        th: 'text-stone-900',
        td: 'text-stone-900',
      }
    }
  }
})