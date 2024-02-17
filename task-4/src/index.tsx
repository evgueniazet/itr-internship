import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Table from "./pages/Table/Table";
import "./index.css";

const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Main page</div>,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "table",
      element: <Table />,
    }
  ]);
  
  const rootElement = document.getElementById("root")!;
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );