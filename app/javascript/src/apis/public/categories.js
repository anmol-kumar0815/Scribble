import axios from "axios";

const list = () => axios.get("/api/public/categories");

const categoriesApi = {
  list,
};

export default categoriesApi;
