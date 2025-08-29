import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Qrcode from "../pages/Qrcode";
import QrcodeShow from "../pages/QrcodeShow";

const AppRouter: React.FC = () => (
  <HashRouter>
    <Routes>
      <Route path="/" element={<Qrcode />} />
      <Route path="/qrcode" element={<Qrcode />} />
      <Route path="/qrcode/:alias" element={<QrcodeShow />} />
      <Route path="*" element={<Qrcode />} />
    </Routes>
  </HashRouter>
);

export default AppRouter;
