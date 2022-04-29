import { Cookies } from "react-cookie";
import nextCookie from "next-cookies";
import Router from "next/router";
import axios from "axios";

const cookies = new Cookies();

export const setToken = async (token: string) => {
  cookies.set("post_app_token", token, { maxAge: 60 * 60 * 24 });
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearToken = () => {
  cookies.remove("post_app_token");
};

export const setTokenToHeader = (context: any) => {
  const { post_app_token } = nextCookie(context);
  axios.defaults.headers.common["Authorization"] = `Bearer ${post_app_token}`;
  return axios;
};

export const handleAuthSSR = async (context: any, role: string = "user") => {
  const { post_app_token } = nextCookie(context);
  const url = `${
    process.env.SERVER_URL || "http://localhost:5000" + "/api"
  }/me`;

  function redirectOnError() {
    if (typeof window !== "undefined") {
      Router.push("/");
    } else {
      context.res.writeHead(302, { Location: "/" });
      context.res.end();
    }
  }

  try {
    if (!post_app_token) {
      return redirectOnError();
    }
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${post_app_token}` },
    });
    if (!response.data || response.data.role !== role) {
      return redirectOnError();
    }
  } catch (error) {
    console.log("Error: ", error);
    return redirectOnError();
  }
  return {};
};
