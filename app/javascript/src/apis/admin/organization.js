import axios from "axios";

const list = () => axios.get("/api/admin/organization");

const update = payload => axios.put("/api/admin/organization", payload);

const authenticate = payload => axios.post("/api/admin/organization", payload);

const organizationApi = { list, update, authenticate };

export default organizationApi;
