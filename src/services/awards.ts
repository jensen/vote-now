import supabase from "services";

export const fetchAwards = () =>
  supabase
    .from<IAwardResource>("awards")
    .select()
    .then((response) => response.data);
