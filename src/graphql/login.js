import { gql } from '@apollo/client';

const LOGIN = gql`
mutation Login($loginInput: LoginInput ){
    login(loginInput: $loginInput) {
        accessToken
        user {
          id
          username
        }
    }
  }
`;

export default LOGIN;