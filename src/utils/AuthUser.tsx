/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useAuthMutation } from "@/redux/features/auth/authApi";
import cookie from "js-cookie";

export const setCookie = (key: any, value: any) => {
  cookie.set(key, value, { expires: 1 });
};

export const removeCookie = (key: any) => {
  cookie.remove(key);
};

export const getCookie = (key: any) => {
  return cookie.get(key);
};

export const setAuthentication = (token: any) => {
  setCookie("token", token);
};

export const setUser = (user: any) => {
  setCookie("user", JSON.stringify({ id: user._id, email: user.email }));
};

export const logout = () => {
  removeCookie("token");
};

export const IsLogin = async () => {
  const [auth, { isSuccess, data, error }] = useAuthMutation();
  const token = getCookie("token");
  if (token) {
    return await auth({ token });
  }

  return false;
};
