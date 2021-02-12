import { gql } from '@apollo/client';

const CREATE_USER = gql`
mutation CreateUser($userInput: UserInput ){
    createUser(userInput: $userInput) {
        id
        username
    }
  }
`;

export default CREATE_USER;