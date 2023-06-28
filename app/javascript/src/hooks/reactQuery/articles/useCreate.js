import { useMutation } from "react-query";

import articlesApi from "apis/admin/articles";

const createArticle = async payload => await articlesApi.create(payload);

const useCreateArticle = ({ onSuccess, onError }) =>
  useMutation({ mutationFn: createArticle, onSuccess, onError });

export default useCreateArticle;
