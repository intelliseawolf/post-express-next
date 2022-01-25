import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { Cookies } from "react-cookie";
import Axios from "axios";

import Layout from "../components/layout";
import { wrapper } from "../store";
import { useAppDispatch } from "../store/hooks";
import { authActions } from "../store/modules/auth.slice";
import theme from "../src/theme";
import useAuth from "../hooks/useAuth";

import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

interface ValidationError {
  location: string;
  msg: string;
  param: string;
  value: string;
}

const cookies = new Cookies();
const token = cookies.get("post_app_token");

Axios.defaults.baseURL =
  process.env.SERVER_URL || "http://localhost:5000" + "/api";
Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
Axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const { data, status } = error.response;

    switch (status) {
      case 400:
        data.errors.map((error: string) => {
          toast.error(error);
        });
        break;

      case 403:
        data.errors.map((error: string) => {
          toast.error(error);
        });
        break;

      case 422:
        data.errors.map((error: ValidationError) => {
          toast.error(error.msg);
        });
        break;

      default:
        break;
    }
    return Promise.reject(error);
  }
);

function App({ Component, pageProps }: AppProps) {
  const [authLoading, setAuthLoading] = React.useState<boolean>(true);
  // @ts-ignore
  const getLayout = Component.getLayout === false ? false : true;
  const dispatch = useAppDispatch();
  const authenticated = useAuth(authLoading);

  React.useEffect(() => {
    Axios.get("/me")
      .then(({ data }) => {
        dispatch(authActions.setCurrentUser(data));
        setAuthLoading(false);
      })
      .catch(() => {
        setAuthLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Post App</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ThemeProvider>
    </>
  );
}

export default wrapper.withRedux(App);
