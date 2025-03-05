import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import env from "../env";

interface TSkills {
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
export const useSkills = () => {
  const skills = useQuery<TSkills[]>({
    queryKey: ["skills"],
    queryFn: async () => {
      const res = await axios.get(`${env?.BACKEND_URL}/api/skills`);
      return res.data.data as TSkills[];
    },
    staleTime: 1000 * 60 * 60 * 24 * 200,
  });

  return skills;
};
