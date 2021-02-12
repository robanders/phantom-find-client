import { gql } from '@apollo/client';

const LOGOUT = gql`
mutation {
    logout
  }
`;

export default LOGOUT;