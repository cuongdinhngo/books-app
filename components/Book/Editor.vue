<template>
  <div id="editor" class="editor-content text-stone-800 min-h-[200px]" @click="handleEditorClick"></div>
</template>

<script setup lang="ts">
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const description = defineModel('description', {
  default: '',
  type: String,
});

let quill: Quill;

const handleEditorClick = () => {
  if (quill) {
    quill.setSelection(0, 0);
    quill.focus();
  }
};

onMounted(() => {
  quill = new Quill('#editor', {
    modules: {
      toolbar: [
        ['bold', 'italic'],
        ['link', 'blockquote', 'code-block'],
        [{ header: [1, 2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
      ],
    },
    theme: 'snow',
  });

  quill.setContents(quill.clipboard.convert({ html:description.value }));

  quill.on('text-change', () => {
    description.value = quill.root.innerHTML;
  });
});
</script>