import { Route, Routes } from "react-router-dom";
import React, { useReducer, useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { ApolloProvider } from "@apollo/client";
import jwtDecode from "jwt-decode";
import { ApolloClient, InMemoryCache } from '@apollo/client';

import AppRoutes from "./AppRoutes";
import { Layout } from "./components/Layout";
import { reducer } from "./lib/reducer";
import "./custom.css";

export const AuthContext = React.createContext({});

export default function App({ pageProps }) {
  const [state, dispatch] = useReducer(reducer, {
    token: null,
    userId: "",
    user: {},
  });

  let uri = process.env.GRAPHQL_API || 'https://localhost:7281/graphql/'

  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });

  const removeUserId = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch({
      type: "SIGN_OUT_USER",
      payload: {
        token: undefined,
        userId: undefined,
      },
    });
  };

  const setUserId = (userId, token) => {
    if (localStorage.userId || localStorage.token) {
      removeUserId();
    }
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token);
    dispatch({
      type: "SET_USER_ID",
      payload: {
        userId: localStorage.userId,
        token: localStorage.token,
        user: jwtDecode(token.split('"').join("")),
      },
    });
  };

  const setToken = (token) => {
    if (localStorage.token) {
      removeToken();
    }

    localStorage.setItem(
      "token",
      JSON.stringify(token.split('"').join("")).slice(1, -1)
    );
    dispatch({
      type: "SET_CURRENT_USER",
      payload: {
        token: localStorage.token,
        user: jwtDecode(token.split('"').join("")),
        userId: localStorage.userId,
      },
    });
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    dispatch({
      type: "SIGN_OUT_USER",
      payload: {
        token: undefined,
        userId: undefined,
      },
    });
  };

  const authContext = useMemo(
    () => ({
      state,
      setToken,
      removeToken,
      setUserId,
      removeUserId,
      token: typeof window !== "undefined" ? localStorage?.token : null,
      restToken: typeof window !== "undefined" ? localStorage?.restToken : null,
      userId: typeof window !== "undefined" ? localStorage?.userId : null,
    }),
    [state]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token) {
      dispatch({
        type: "SET_CURRENT_USER",
        payload: { token, userId, user: jwtDecode(token.split('"').join("")) },
      });
    } else {
      dispatch({
        type: "REMOVE_CURRENT_USER",
        payload: {
          userId: null,
          token: null,
          user: {},
        },
      });
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={authContext}>
        <Toaster />
        <Layout>
          <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>
        </Layout>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}
