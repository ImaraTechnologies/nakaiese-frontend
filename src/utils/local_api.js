import axios from "axios";

const BASE_URL = "/api/"
const localapi = axios.create({
    baseURL: BASE_URL,
    timeout: 15000, // 15s is safer for slower mobile networks
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // CRITICAL: Allows cookies to be sent/received (for refresh tokens)
});

export default localapi;