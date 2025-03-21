import { managerApi } from "@/lib/axios";
import { setHotelDetails } from "@/reducers/fullAppReducer";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

const useGetOwnerHotel = () => {
  const dispatch = useDispatch();

  const data = useQuery({
    queryKey: ["getOwnerHotel"],
    queryFn: async () => {
      const { data } = await managerApi.get("/");
      dispatch(setHotelDetails(data));
      return data as Hotel;
    },
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchInterval: 60000,
  });
  return data;
};

export { useGetOwnerHotel };
