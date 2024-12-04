import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../services/firebase';

interface AuthProviderProps {
  children: React.ReactNode;
}

async function getFirebaseToken(getAccessTokenSilently: () => Promise<string>) {
  try {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/firebase-token`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const { firebaseToken } = await response.json();
    return firebaseToken;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
}

function AuthStateManager({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const firebaseToken = await getFirebaseToken(getAccessTokenSilently);
        if (firebaseToken) {
          await signInWithCustomToken(auth, firebaseToken);
        }
      })();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

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
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <AuthStateManager>
        {children}
      </AuthStateManager>
    </Auth0Provider>
  );
}
