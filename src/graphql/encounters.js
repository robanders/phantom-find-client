import { gql } from '@apollo/client';

const GET_ENCOUNTERS = gql`
    query {
        encounters {
            id
            lat
            lng
        }
    }
`;

export default GET_ENCOUNTERS;