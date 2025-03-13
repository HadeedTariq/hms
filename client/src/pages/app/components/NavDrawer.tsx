import { Menu } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Link } from "react-router-dom";

import { authApi } from "@/lib/axios";
import { useFullApp } from "@/store/hooks/useFullApp";
import { Button } from "@/components/ui/button";

export function NavDrawer() {
  const { user } = useFullApp();
  const logout = async () => {
    await authApi.post("/logout");
    window.location.reload();
  };
  return (
    <Drawer>
      <DrawerTrigger
        asChild
        className="bg-orange-500 p-2 rounded-md absolute right-0"
      >
        <Menu color="white" size={35} />
      </DrawerTrigger>
      <DrawerContent className="w-full h-full">
        <div className="flex flex-col ">
          {user ? (
            <>
              <DrawerClose asChild>
                <Link to={"/profile"}>
                  <Button variant={"link"}>Profile</Button>
                </Link>
              </DrawerClose>
              <p
                className=" px-5 py-2.5 text-sm font-medium text-white transition font-ubuntu "
                onClick={logout}
              >
                Logout
              </p>
            </>
          ) : (
            <>
              <DrawerClose asChild>
                <Link
                  className="px-5 py-2.5 text-sm font-medium  transition font-ubuntu hover:text-orange-500 hover:underline"
                  to="/auth/login"
                >
                  Login
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  className="px-5 py-2.5 text-sm font-medium  font-ubuntu transition hover:text-orange-500 hover:underline"
                  to="/auth/register"
                >
                  Register
                </Link>
              </DrawerClose>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
