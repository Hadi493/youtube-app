import { create } from "zustand";

const userData = create((set) => (
    {
        currentUserData: {
            data: null,
            loading: false,
            isUser: false,
            notUser: false,
        },

        setCurrentUserData: (value) => set((state) => (
            {
                currentUserData: {
                    ...state.currentUserData,
                    ...value
                }
            }
        )),
    }
))

export default userData