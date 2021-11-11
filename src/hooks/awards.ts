import { useQuery } from "react-query";
import { fetchAwards } from "services/awards";

export const useAwards = () => {
  const query = useQuery<IAwardResource[], Error>("awards", fetchAwards as any);

  return query.data || [];
};

export const useAwarded = (submissionId: string) => {};
