import { Route, Routes } from "react-router-dom";
import Register from "./pages/auth/routes/Register";
import Login from "./pages/auth/routes/Login";
import LoadingBar from "./components/LoadingBar";
import { useFullApp } from "./store/hooks/useFullApp";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "./lib/axios";
import { setUser } from "./reducers/fullAppReducer";
import { useEffect } from "react";
import AuthProtector from "./pages/auth/components/AuthProtector";
import NavBar from "./pages/app/components/Navbar";

import Home from "./pages/app/routes/Home";
import ManagerDashboardHome from "./pages/app/routes/manager/ManagerDashboardHome";
import { ManagerDashboardLayout } from "./pages/app/routes/manager/components/DashboardLayout";
import HotelCreationForm from "./pages/app/routes/manager/HotelCreationForm";
import RoomHandling from "./pages/app/routes/manager/components/RoomHandling";

function App() {
  const { user } = useFullApp();

  const dispatch = useDispatch();

  const { isPending, mutate: authUser } = useMutation({
    mutationKey: ["authenticateUser"],
    mutationFn: async () => {
      const { data } = await authApi.get("/");
      dispatch(setUser(data));
    },
    onError: async () => {
      const { status } = await authApi.post("/refreshAccessToken");
      if (status < 400) {
        const { data } = await authApi.get("/");
        dispatch(setUser(data));
      }
    },
  });

  useEffect(() => {
    if (!user) {
      authUser();
    }
  }, [user]);

  if (isPending) return <LoadingBar />;
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/manager-dashboard" element={<ManagerDashboardLayout />}>
        <Route index element={<ManagerDashboardHome />} />
        <Route path="handleRooms" element={<RoomHandling />} />
      </Route>
      <Route path="/manager/create-hotel" element={<HotelCreationForm />} />
      <Route path="/auth" element={<AuthProtector />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
