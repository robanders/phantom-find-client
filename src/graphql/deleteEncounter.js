import { gql } from '@apollo/client';

const DELETE_ENCOUNTER = gql`
mutation DeleteEncounter($encounterId: ID ){
    deleteEncounter(encounterId: $encounterId)
  }
`;

export default DELETE_ENCOUNTER;