declare global {
    interface ImportMetaEnv {
        VITE_API_HOST: string
    }
}

export const { VITE_API_HOST: API_HOST } = import.meta.env