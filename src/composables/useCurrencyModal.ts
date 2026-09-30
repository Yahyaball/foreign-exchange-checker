import { ref } from "vue";

const openTarget = ref<"send" | "receive" | null>(null);

export function useCurrencyModal() {
  const open = (target: "send" | "receive" | null) => {
    openTarget.value = target;
  };
  return { openTarget, open };
}
