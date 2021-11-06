import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "pages/Login";
import Projects from "pages/Projects";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Projects />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
