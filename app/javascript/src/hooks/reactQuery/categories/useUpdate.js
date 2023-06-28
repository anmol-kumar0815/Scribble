import { useMutation } from "react-query";

import categoriesApi from "apis/admin/categories";

const updateCategory = async ({ id, payload }) =>
  await categoriesApi.update(id, payload);

const useUpdateCategory = ({ onSuccess, onError }) =>
  useMutation({ mutationFn: updateCategory, onSuccess, onError });

export default useUpdateCategory;
