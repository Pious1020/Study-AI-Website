import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthProviderProps {
  children: React.ReactNode;
}

function AuthStateManager({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getIdTokenClaims } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const claims = await getIdTokenClaims();
          if (claims) {
            // Use the ID token as a custom token for Firebase
            await signInWithCustomToken(auth, claims.__raw);
          }
        } catch (error) {
          console.error('Error signing in to Firebase:', error);
        }
      })();
    }
  }, [isAuthenticated, getIdTokenClaims]);

  return <>{children}</>;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    throw new Error('Missing Auth0 credentials');
  }

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <AuthStateManager>
        {children}
      </AuthStateManager>
    </Auth0Provider>
  );
}
