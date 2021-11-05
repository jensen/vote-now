import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "pages/Login";

const Router = () => {
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>;
};

export default Router;
