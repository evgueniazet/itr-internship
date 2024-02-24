import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Table from "./pages/Table/Table";
import PrivateRoute from "./routing/PrivateRoute";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="table" element={<PrivateRoute Component={Table} />} />
    </Routes>
  );
};

export default App;
