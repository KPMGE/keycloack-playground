import Keycloak from "keycloak-js"

const keycloakConfig = {
  url: 'http://localhost:8080/',
  realm: 'test-realm',
  clientId: 'test-keycloak'
}

export const keycloak = new Keycloak(keycloakConfig)
