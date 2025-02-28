import env from "@/src/lib/env";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface TTool {
  _id: string;
  title: string;
  logo: Logo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Logo {
  _id: string;
  viewUrl: string;
}

export const useTools = () => {
  const tools = useQuery<TTool[]>({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await axios.get(`${env?.BACKEND_URL}/api/tools`);
      return res.data.data as TTool[];
    },
    staleTime: 1000 * 60 * 60 * 24 * 200,
  });

  return tools;
};
