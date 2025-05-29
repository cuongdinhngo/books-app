<template>
  <div class="description-display" v-html="sanitizedContent"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  content: string;
}>();

import DOMPurify from 'dompurify';

const sanitizedContent = computed(() => {
  return DOMPurify.sanitize(props.content, { ADD_ATTR: ['contenteditable'] });
});
</script>

<style>
.description-display {
  font-size: 0.875rem;
  line-height: 1.625;
  color: #374151;
  max-width: none;
}

/* Headers */
.description-display h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #111827;
}

.description-display h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #111827;
}

.description-display h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

/* Paragraphs */
.description-display p {
  margin-bottom: 1rem;
}

/* Bold text */
.description-display strong,
.description-display b {
  font-weight: 700 !important;
  color: inherit !important;
}

/* Italic text */
.description-display em,
.description-display i {
  font-style: italic !important;
  color: inherit !important;
}

/* Links */
.description-display a {
  color: #3b82f6;
  text-decoration: underline;
}

.description-display a:hover {
  color: #1d4ed8;
}

/* Blockquotes */
.description-display blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 1rem;
}

/* Code blocks */
.description-display pre {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.description-display code {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.description-display pre code {
  background-color: transparent;
  padding: 0;
}

/* Ordered lists */
.description-display ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

/* Bullet lists */
.description-display ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

/* List items */
.description-display li {
  margin-bottom: 0.5rem;
  color: #374151;
}

/* Hide Quill UI elements */
.description-display .ql-ui {
  display: none;
}
</style>