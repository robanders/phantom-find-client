import { gql } from '@apollo/client';

const GET_ENCOUNTER = gql`
query GetEncounter($encounterId: ID){
    encounter(encounterId: $encounterId) {
      id
      lat
      lng
      title
      description
      createdAt
      creator {
          id
          username
      }
    }
  }
`;

export default GET_ENCOUNTER;