import axios from "axios";

const list = payload =>
  axios.get("/api/admin/articles", {
    params: {
      selected_category_ids: payload.selectedCategoryIds,
      searched_title: payload.searchedTitle,
      selected_status: payload.selectedStatus,
      page: payload.page,
    },
  });

const create = payload => axios.post("/api/admin/articles", payload);

const destroy = payload =>
  axios.post("/api/admin/articles/bulk_delete", payload);

const update = (id, payload) => axios.put(`/api/admin/articles/${id}`, payload);

const show = id => axios.get(`/api/admin/articles/${id}`);

const move = payload => axios.patch("/api/admin/articles/move", payload);

const reorder = (id, payload) =>
  axios.patch(`/api/admin/articles/${id}/reorder`, payload);

const statusCounts = payload =>
  axios.get("/api/admin/articles/status_counts", {
    params: {
      selected_category_ids: payload.selectedCategoryIds,
    },
  });

const published = payload =>
  axios.get("api/admin/articles/published", { params: payload });

const versions = id => axios.get(`api/admin/articles/${id}/versions`);

const generatePdf = () => axios.post("api/admin/articles/report", {});

const download = () =>
  axios.get("api/admin/articles/report/download", { responseType: "blob" });

const articlesApi = {
  list,
  create,
  destroy,
  update,
  show,
  move,
  reorder,
  statusCounts,
  published,
  versions,
  generatePdf,
  download,
};

export default articlesApi;
