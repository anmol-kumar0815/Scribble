import { useMutation } from "react-query";

import articlesApi from "apis/admin/articles";

const destroyArticles = async ids => await articlesApi.destroy({ ids });

const useDeleteArticles = ({ onSuccess, onError }) =>
  useMutation({ mutationFn: destroyArticles, onSuccess, onError });

export default useDeleteArticles;
