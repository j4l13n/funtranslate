import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      token
      data {
        id
        email
      }
    }
  }
`;

export const REGISTER = gql`
  mutation ($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      success
      message
      token
      data {
        id
        email
      }
    }
  }
`;

export const USERS = gql`
  query {
    users {
      users {
        id
        email
      }
    }
  }
`;
