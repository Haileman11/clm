import KeycloakAdminClient from "@keycloak/keycloak-admin-client";

export async function getKeyCloakAdminClient() {
  const keycloakAdmin = new KeycloakAdminClient({
    baseUrl: process.env.KEYCLOAK_BASE_URL,
    realmName: process.env.KEYCLOAK_REALM,
  });

  async function initKeycloak() {
    await keycloakAdmin.auth({
      grantType: "client_credentials",
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    });
  }
  await initKeycloak();
  return keycloakAdmin;
}
