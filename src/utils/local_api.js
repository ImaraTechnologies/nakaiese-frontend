import axios from "axios";


const localapi = axios.create({
    baseURL: "/api/", 
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, 
});

export default localapi;