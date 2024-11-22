import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ApolloClient, InMemoryCache, ApolloProvider,makeVar, createHttpLink} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {Auth0Provider, useAuth0} from "@auth0/auth0-react"

export const starredVar = makeVar([])

const AppWithApollo = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const httpLink = createHttpLink({
    uri: "http://localhost:4000",
  });

  const authLink = setContext(async (_, { headers }) => {
    const accessToken = isAuthenticated
      ? await getAccessTokenSilently()
      : undefined;
    if (accessToken) {
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      };
    } else {
      return {
        headers: {
          ...headers,
        },
      };
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Business: {
          fields: {
            isStarred: {
              read(_, { readField }) {
                return starredVar().includes(readField("businessId"));
              },
            },
          },
        },
      },
    }),
  });

  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider 
      domain='dev-332ybztd8aifgjxm.us.auth0.com'
      clientId='GTQTe7RdjylRQF2UV9TudZHTTpMqrvUh'
      redirectUri={window.location.origin}
      audience="https://reviews.grandstack.io"
    >
      <AppWithApollo/>
    </Auth0Provider>
  </React.StrictMode>
);
