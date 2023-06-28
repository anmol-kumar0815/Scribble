import { useMutation } from "react-query";

import articlesApi from "apis/admin/articles";

const updateArticle = async ({ id, payload }) =>
  await articlesApi.update(id, payload);

const useUpdateArticle = ({ onSuccess, onError }) =>
  useMutation({ mutationFn: updateArticle, onSuccess, onError });

export default useUpdateArticle;
