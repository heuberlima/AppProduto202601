import axios from "axios";

const api = axios.create({
    baseURL: "http://10.200.3.27:8080/pcontroller",
});

export default api;