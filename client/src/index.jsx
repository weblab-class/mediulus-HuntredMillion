import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Account from "./components/pages/Account";
import Feed from "./components/pages/Feed";
import Create from "./components/pages/Create";
import NotFound from "./components/pages/NotFound";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "621419868174-h7g79nu7thn73qppsc64319u59v3fk1j.apps.googleusercontent.com";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<Feed />} />
      <Route path="/account" element={<Account />} />
      <Route path="/create" element={<Create />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
);

