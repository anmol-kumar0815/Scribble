import axios from "axios";

const list = () => axios.get("/api/public/articles");

const show = slug => axios.get(`/api/public/articles/${slug}`);

const articlesApi = { list, show };

export default articlesApi;
