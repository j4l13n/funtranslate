import merge from "deepmerge";
import isEqual from "lodash-es/isEqual";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";

let apolloClient = null;

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let token;

export const createApolloClient = () => {
  const TOKEN = token || null;

  const link = new HttpLink({
    uri: process.env.NEXT_PUBLIC_ARENA_SEATS_API_URL,
    credentials: 'same-origin',
  });

  const authContext = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: `JWT ${TOKEN}`,
    },
  }));

  const authLink = authContext.concat(link);

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: TOKEN ? authLink : link,
    cache: new InMemoryCache(),
  });
};

export const initializeApollo = (data) => {
  token = data?.token;
  const _apolloClient = createApolloClient();

  if (data?.initialState) {
    _apolloClient.cache.restore(data.initialState);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}
