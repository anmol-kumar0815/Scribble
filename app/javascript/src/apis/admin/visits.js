import axios from "axios";

const update = (slug, payload) =>
  axios.put(`/api/admin/visits/${slug}`, payload);

const visitsApi = { update };

export default visitsApi;
