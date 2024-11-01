import {
  SELF_ATTESTATION_SCHEMA_UID,
  THIRD_PARTY_ATTESTATION_SCHEMA_UID,
} from "@/hooks/useAttestationCreation";
import { gql } from "urql";

export const ATTESTATIONS_FOR_SPECIFIC_ATTESTER = gql`
  query AttestationsForSpecificAttester($attester: String!) {
    attestations(
      where: {
        attester: { equals: $attester }
        schemaId: {
          in: [
            "${THIRD_PARTY_ATTESTATION_SCHEMA_UID}"
            "${SELF_ATTESTATION_SCHEMA_UID}"
          ]
        }
      }
    ) {
      id
      attester
      recipient
      revocable
      revocationTime
      expirationTime
      revoked
      schema {
        id
      }
    }
  }
`;

export const ATTESTATIONS_FOR_SPECIFIC_KEY = gql`
  query ($publicKeyOrFingerprintOrUid: String!) {
    selfAttestations: attestations(
      where: {
        AND: [
          { schemaId: { equals: "${SELF_ATTESTATION_SCHEMA_UID}" } }
          {
            OR: [
              { id: { equals: $publicKeyOrFingerprintOrUid } }
              { decodedDataJson: { contains: $publicKeyOrFingerprintOrUid } }
            ]
          }
        ]
      }
    ) {
      id
      attester
      decodedDataJson
      timeCreated
      revocationTime
    }
    thirdPartyAttestations: attestations(
      where: {
        AND: [
          { schemaId: { equals: "${THIRD_PARTY_ATTESTATION_SCHEMA_UID}" } }
          {
            OR: [
              { id: { equals: $publicKeyOrFingerprintOrUid } }
              { decodedDataJson: { contains: $publicKeyOrFingerprintOrUid } }
            ]
          }
        ]
      }
      orderBy: { timeCreated: desc }
    ) {
      id
      attester
      decodedDataJson
      timeCreated
      revocationTime
    }
  }
`;
