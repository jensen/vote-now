import { useEffect } from "react";
import supabase from "services";

const Projects = () => {
  useEffect(() => {
    supabase
      .from("profiles")
      .select()
      .then((result) => console.log(result));
  }, []);
  return <div>Projects</div>;
};

export default Projects;
