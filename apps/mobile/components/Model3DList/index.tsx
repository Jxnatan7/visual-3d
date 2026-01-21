import React, { useCallback } from "react";
import {
  PaginatedFlashList,
  PaginatedFlashListProps,
  PaginatedResult,
} from "../theme/PaginatedFlashList";
import useModels3D from "@/hooks/useModels3D";
import { Model3D } from "@/services/Model3DService";

export type Model3DListProps = Partial<PaginatedFlashListProps<Model3D>> & {
  renderItem: any;
  search?: string;
};

export const Model3DList = ({
  renderItem,
  search,
  ...props
}: Model3DListProps) => {
  const { mutateAsync } = useModels3D();

  const fetchRequests = useCallback(
    async (
      page: number,
      pageSize: number,
    ): Promise<PaginatedResult<Model3D> | undefined> => {
      const { data: response } = await mutateAsync({
        q: search,
        page,
        pageSize,
      });

      return response;
    },
    [mutateAsync, search],
  );

  return (
    <PaginatedFlashList<Model3D>
      {...props}
      style={{ alignSelf: "center", backgroundColor: "transparent" }}
      renderItem={renderItem}
      fetchData={fetchRequests}
      pageSize={10}
      horizontal={false}
      numColumns={2}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};
