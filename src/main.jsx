import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";                 // donde renders tu landing
import BrandDetail from "./BrandDetail.jsx"; // nuevo
import "./index.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/brand/:slug", element: <BrandDetail /> },
]);

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
