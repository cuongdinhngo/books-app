<template>
  <UButton
    label="QR Code"
    icon="lucide:qr-code"
    color="primary"
    variant="subtle"
    @click="qrModalOpen = !qrModalOpen"
  />
  <UModal
    :title="`QR Code of #${copyId}`"
    v-model:open="qrModalOpen"
  >
    <template #body>
      <div class="flex flex-col items-center">
        <canvas ref="qrCanvas" class="mb-2"></canvas>
        <p class="text-sm text-gray-600">Scan to view</p>
      </div>
    </template>
    <template #footer>
      <UButton label="Close" color="neutral" variant="outline" @click="qrModalOpen = false" />
      <UButton label="Print" color="neutral" @click="printQRCode" />
    </template>
  </UModal>
</template>
<script setup lang="ts">
import QRCode from 'qrcode';

const props = defineProps({
  bookId: {
    type: Number,
    required: true
  },
  copyId: {
    type: Number,
    required: true
  }
});

const qrModalOpen = ref(false);
const qrCanvas = ref<HTMLCanvasElement | null>(null);

function generateQRCode() {
  if (qrCanvas.value) {
    const appPath = getAppPath();
    const bookUrl = `${appPath}admin/books/${props.bookId}?copy=${props.copyId}`;
    QRCode.toCanvas(
      qrCanvas.value,
      bookUrl,
      { width: 150 },
      (error) => {
        if (error) {
          console.error('Error generating QR code => ', error);
        }
      }
    );
  }
}

function printQRCode() {
  if (!qrCanvas.value) return;
  const dataUrl = qrCanvas.value.toDataURL();
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            img { width: 150px; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="QR Code" />
          <h4>QR Code for Book #${props.copyId}</h4>
          <script>
            window.onload = function() { window.print(); window.onafterprint = window.close; }
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}

watch(qrModalOpen, (open) => {
  if (open) {
    nextTick(() => {
      generateQRCode();
    });
  }
});
</script>