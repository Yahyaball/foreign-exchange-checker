import { ref } from "vue";

const message = ref("");

const announce = (text: string) => {
  message.value = text;
};

export function useAnnounce() {
  return { message, announce };
}

if (import.meta.env.DEV) Object.assign(window, { announce });
