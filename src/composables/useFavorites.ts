import { ref, watchEffect } from "vue";

export interface Currency {
  base: string;
  quote: string;
}

function loadFavorites(): Currency[] {
  try {
    return JSON.parse(localStorage.getItem("fx-favorites") || "[]");
  } catch (err) {
    console.warn(err);
    return [];
  }
}

const favorites = ref<Currency[]>(loadFavorites());

watchEffect(() => {
  localStorage.setItem("fx-favorites", JSON.stringify(favorites.value));
});

export function useFavorites() {
  return { favorites };
}
