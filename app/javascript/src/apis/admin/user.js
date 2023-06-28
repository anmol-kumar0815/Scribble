import axios from "axios";

const currentUser = () => axios.get("api/admin/user");

const userApi = { currentUser };

export default userApi;
