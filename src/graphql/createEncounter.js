import { gql } from '@apollo/client';

const CREATE_ENCOUNTER = gql`
mutation CreateEncounter($encounterInput: EncounterInput ){
    createEncounter(encounterInput: $encounterInput) {
        id
    }
  }
`;

export default CREATE_ENCOUNTER;