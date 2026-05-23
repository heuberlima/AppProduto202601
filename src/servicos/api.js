import axios from "axios";

const api = axios.create({
    baseURL: "http://10.96.75.9:8080/pcontroller",
});

export default api;