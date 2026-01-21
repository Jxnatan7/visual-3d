import Model3DService, { FilterRequest } from "@/services/Model3DService";
import { useMutation } from "@tanstack/react-query";

const useModels3D = function (onSuccess: () => void = () => {}) {
  const { data, isSuccess, isPending, error, mutate, mutateAsync } =
    useMutation({
      mutationFn: (payload: FilterRequest) => Model3DService.search(payload),
      mutationKey: ["models-3d"],
      onSuccess,
    });

  return { data, isSuccess, isPending, error, mutate, mutateAsync };
};

export default useModels3D;
