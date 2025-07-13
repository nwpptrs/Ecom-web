<script setup>
import { ref, defineProps, defineEmits } from "vue";
import imageCompression from "browser-image-compression";
import { uploadProfile } from "../../api/user";
import { removeFile, uploadFiles } from "../../api/product";
import { useAuthStore } from "../../store/auth";
import { useToast } from "vue-toastification";
import { ArrowPathIcon } from "@heroicons/vue/24/solid";

const toast = useToast();
const store = useAuthStore();
const token = store.token;

const props = defineProps({
  modelValue: {
    type: [Array, Object, null],
    default: () => [],
  },
  single: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const isLoading = ref(false);

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const handleChange = async (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  isLoading.value = true;

  try {
    if (props.single) {
      const file = files[0];
      if (!file.type.startsWith("image/")) return;

      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 720,
      });

      const base64 = await fileToBase64(compressed);
      await uploadProfile(token, base64);
      toast.success("อัปโหลดรูปโปรไฟล์สำเร็จ");
      emit("uploaded");
    } else {
      const uploadedImages = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;

        const compressed = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 720,
        });

        const base64 = await fileToBase64(compressed);
        const res = await uploadFiles(token, base64);
        uploadedImages.push(res.data);
      }

      if (uploadedImages.length) {
        emit("update:modelValue", [...props.modelValue, ...uploadedImages]);
        toast.success("อัปโหลดรูปภาพสำเร็จ");
      }
    }
  } catch (err) {
    console.error(err);
    toast.error("อัปโหลดรูปภาพล้มเหลว");
  } finally {
    isLoading.value = false;
    e.target.value = "";
  }
};

const handleDelete = async (public_id) => {
  const updatedImages = props.modelValue.filter((img) => {
    return img.public_id !== public_id;
  });
  emit("update:modelValue", updatedImages);
  try {
    removeFile(token, public_id);
    toast.success("Remove Image Success!!");
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <div>
    <input
      class="bg-gray-200 border p-1"
      type="file"
      :multiple="!single"
      accept="image/*"
      @change="handleChange"
      :disabled="isLoading"
    />

    <ArrowPathIcon v-if="isLoading" class="w-6 animate-spin mt-2" />

    <div v-if="!single" class="grid grid-cols-3 gap-4 mt-4">
      <div
        v-for="(img, index) in props.modelValue"
        :key="img.public_id"
        class="relative rounded overflow-hidden shadow"
      >
        <img
          :src="img.secure_url || img.url"
          class="object-cover w-full h-32 hover:scale-105"
        />
        <button
          @click="handleDelete(img.public_id)"
          class="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded"
        >
          ลบ
        </button>
      </div>
    </div>
  </div>
</template>
