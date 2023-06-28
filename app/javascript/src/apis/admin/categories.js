import axios from "axios";

const list = payload =>
  axios.get("/api/admin/categories", {
    params: {
      searched_name: payload.searchedName,
    },
  });

const create = payload => axios.post("/api/admin/categories", payload);

const update = (id, payload) =>
  axios.put(`/api/admin/categories/${id}`, payload);

const destroy = (id, payload) =>
  axios.delete(`/api/admin/categories/${id}`, {
    params: {
      move_articles_into_category_id: payload.moveArticlesToCategory,
    },
  });

const reorder = (id, payload) =>
  axios.patch(`/api/admin/categories/${id}/reorder`, payload);

const categoriesApi = { list, create, update, destroy, reorder };

export default categoriesApi;
