import React, { createContext, useEffect, useRef, useState } from "react";
import Keycloak from "keycloak-js";

interface KeycloakContextProps {
  keycloak: Keycloak | null;
  authenticated: boolean;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(
  undefined,
);

interface KeycloakProviderProps {
  children: React.ReactNode;
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const isRun = useRef<boolean>(false);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    if (isRun.current) return;

    isRun.current = true;

    const initKeycloak = () => {
      const keycloackConfig = {
        url: import.meta.env.VITE_KEYCLOAK_URL as string,
        realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT as string,
      };
      const keycloakInstance: Keycloak = new Keycloak(keycloackConfig);

      keycloakInstance
        .init({
          onLoad: "check-sso",
        })
        .then((auth: boolean) => {
          setAuthenticated(auth);
        })
        .catch((error) => {
          console.error("Keycloak initialization failed:", error);
          setAuthenticated(false);
        })
        .finally(() => {
          setKeycloak(keycloakInstance);
          console.log("keycloak", keycloakInstance);
        });
    };

    initKeycloak();
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated }}>
      {children}
    </KeycloakContext.Provider>
  );
};

export { KeycloakProvider, KeycloakContext };
