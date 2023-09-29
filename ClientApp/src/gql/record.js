import { gql } from "@apollo/client";

export const RECORDS = gql`
  query {
    records {
      id
      userId
      inputText
      funText
      targetLanguage
    }
  }
`;

export const ADD_RECORD = gql`
  mutation ($originalText: String!, $targetLanguage: String!, $userId: Int!) {
    addRecord(
      originalText: $originalText
      targetLanguage: $targetLanguage
      userId: $userId
    ) {
      success
      message
      data {
        id
        userId
        inputText
        funText
        targetLanguage
      }
    }
  }
`;
