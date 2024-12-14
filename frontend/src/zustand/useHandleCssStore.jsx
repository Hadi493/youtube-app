import { create } from "zustand"

const useHandleCssStore = create((set) => ({
    toggelBarCss: "left-[-20rem]",
    coverAll: "",
    showUploadVideoCss: false,
    toggleSideBar: () => set((state) => {
        const newToggelBarCss = state.toggelBarCss === "left-[-20rem]" ? "left-[0]" : "left-[-20rem]";
        return {
            toggelBarCss: newToggelBarCss,
            coverAll: newToggelBarCss === "left-[0]" ? "!bg-[#2c2c2c3f] h-screen top-[-73px] relative" : ""
        };
    }),
    handleClickOutside: (e) =>
        set(() => {
            const newToggelBarCss = !e?.target.closest("#logo-sidebar") && !e?.target.closest("#mainMenu") || e?.target.closest(".slideLeft") ? "left-[-20rem]" : "left-[0]";
            return {
                toggelBarCss: newToggelBarCss,
                coverAll: newToggelBarCss === "left-[0]" ? "!bg-[#2c2c2c3f] h-screen top-[-73px] relative" : ""
            }
        }),
        
    showUploadVideo: (value) => set(() => ({
        showUploadVideoCss: value
    }))
}))

export default useHandleCssStore
