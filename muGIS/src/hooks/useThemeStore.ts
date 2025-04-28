import { create } from 'zustand';

type Theme = "light" | "dark";

interface ThemeStore {
    theme: Theme;
    setTheme: (newTheme: Theme) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({

    theme: localStorage.getItem("theme") as Theme || "light",

    setTheme: (newTheme: Theme) => set((state) => {
        localStorage.setItem("theme", newTheme);
        if (newTheme === state.theme) {
            return state;
        }
        return { theme: newTheme };
    }),

}));

export default useThemeStore;