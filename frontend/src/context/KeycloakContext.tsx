import React, { createContext, useEffect, useRef, useState } from "react";
import Keycloak from "keycloak-js";

interface KeycloakContextProps {
  keycloak: Keycloak | null;
  authenticated: boolean;
  userPicture: string | null;
}

interface KeycloakState {
  keycloak: Keycloak | null;
  authenticated: boolean;
  userPicture: string | null;
}

const KeycloakContext = createContext<KeycloakContextProps | undefined>(
  undefined,
);

interface KeycloakProviderProps {
  children: React.ReactNode;
}

const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const isRun = useRef<boolean>(false);
  const [state, setState] = useState<KeycloakState>({
    keycloak: null,
    authenticated: false,
    userPicture: null,
  });

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
          onLoad: "login-required",
        })
        .then((auth: boolean) => {
          const picture = auth ? keycloakInstance.tokenParsed?.picture : null;
          setState({
            keycloak: keycloakInstance,
            authenticated: auth,
            userPicture: picture,
          });
          console.log("keycloak", keycloakInstance);
        })
        .catch((error) => {
          console.error("Keycloak initialization failed:", error);
          setState({ keycloak: null, authenticated: false, userPicture: null });
        });
    };

    initKeycloak();
  }, []);

  return (
    <KeycloakContext.Provider value={state}>
      {children}
    </KeycloakContext.Provider>
  );
};

export { KeycloakProvider, KeycloakContext };
