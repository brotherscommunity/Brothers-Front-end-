"use client";

import { Provider } from "react-redux";
import store from "./store";
import {
  stop_loading,
  set_current_user,
  start_loading,
} from "@/redux/features/UserSlice";
import { useEffect, useCallback } from "react";
import { authFetch } from "@/lib/authFetch";
import { NEXT_PUBLIC_BACKEND_URL, NEXT_API_URL, USER } from "@/constants";

interface StroreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StroreProviderProps) {
  const fetchUser = useCallback(async () => {
    try {
      store.dispatch(start_loading());
      const user: USER | null = await authFetch("auth/profile");
      if (user) {
        store.dispatch(set_current_user(user));
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      store.dispatch(stop_loading());
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

//   const user = {
//     email: "abebe@gmail.com",
//     username: "abebe232",
//     firstName: "Abebe",
//     lastName: "Balcha",

//     referalId: "42501225585",
//     city: "Addis Ababa",
//     country: "Ethiopia",
//   };
