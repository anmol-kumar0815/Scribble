import { createConsumer } from "@rails/actioncable";

const buildWebsocketURL = () => {
  const userEmail = JSON.parse(localStorage.getItem("userEmail"));

  return encodeURI(`/cable?user_email=${userEmail}`);
};

export default () => createConsumer(buildWebsocketURL());
