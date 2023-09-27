import { gql } from "@apollo/client";

export const RECORDS = gql`
  query {
    records {
      id
      userId
      inputText
      funText
    }
  }
`;
