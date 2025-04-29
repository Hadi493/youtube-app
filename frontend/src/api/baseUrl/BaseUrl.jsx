import axios from "axios"

const url = import.meta.env.VITE_API_URL
// console.log('url',url);
// 'https://youtube-backend-latest.onrender.com/api/v1'

const baseUrl = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json"
    },
})


export const PrivetBaseUrl = axios.create({
    baseURL: url,
    headers: {
        "Content-Type": "application/json"
    },
})

export default baseUrl