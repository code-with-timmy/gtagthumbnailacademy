import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Signin from "./pages/Authentication/Signin";
import Signup from "./pages/Authentication/Signup";
import Course from "./pages/Course";
// import { Upload } from "lucide-react";
import Purchase from "./pages/Purchase";
import Assets from "./pages/Assets";
// import AdminKofi from "./pages/AdminKofi";
import AppLayout from "./components/ui/AppLayout";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import ProtectedRouteForCourse from "./components/ui/ProtectedRouteForCourse";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <BrowserRouter>
        <Routes>
          {/* GROUP A: Requires ONLY Login (Authenticated users) */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="home" />} />
            <Route path="home" element={<Home />} />
            <Route path="purchase" element={<Purchase />} /> {/* Moved here! */}
            {/* GROUP B: Requires Login AND a Paid Subscription */}
            <Route element={<ProtectedRouteForCourse />}>
              <Route path="course" element={<Course />} />
              <Route path="assets" element={<Assets />} />
              {/* <Route path="upload" element={<Upload />} /> */}
            </Route>
            {/* <Route path="adminKofi" element={<AdminKofi />} /> */}
          </Route>

          {/* GROUP C: Public Routes */}
          <Route path="login" element={<Signin />} />
          <Route path="create-account" element={<Signup />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-0)",
            color: "var(--color-grey-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
