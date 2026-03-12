import { useState, useCallback } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GOOGLE_WEB_CLIENT_ID } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';

WebBrowser.maybeCompleteAuthSession();

const PROXY_BASE = 'https://auth.expo.io/@bushra2002/Ride';

function buildGoogleAuthUrl(returnUrl: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_WEB_CLIENT_ID,
    redirect_uri: PROXY_BASE,
    response_type: 'token',
    scope: 'openid profile email',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  const proxyStart = `${PROXY_BASE}/start?authUrl=${encodeURIComponent(
    googleAuthUrl,
  )}&returnUrl=${encodeURIComponent(returnUrl)}`;

  return proxyStart;
}

function parseHashParams(url: string): Record<string, string> {
  const hash = url.split('#')[1] ?? url.split('?')[1] ?? '';
  const entries = hash.split('&').map((p) => p.split('='));
  return Object.fromEntries(entries);
}

export function useGoogleSignIn() {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogleToken);
  const setError = useAuthStore((s) => s.setError);
  const setLoading = useAuthStore((s) => s.setLoading);

  const [ready, setReady] = useState(true);

  const promptAsync = useCallback(async () => {
    try {
      const returnUrl = makeRedirectUri();
      const authUrl = buildGoogleAuthUrl(returnUrl);

      const result = await WebBrowser.openAuthSessionAsync(authUrl, returnUrl);

      if (result.type === 'success' && result.url) {
        const params = parseHashParams(result.url);
        const accessToken = params['access_token'];
        const idToken = params['id_token'];

        if (idToken) {
          await signInWithGoogle(idToken);
        } else if (accessToken) {
          await signInWithGoogle(undefined, accessToken);
        } else {
          setError('Could not retrieve Google credentials. Try again.');
        }
      } else if (result.type === 'cancel') {
        // user closed the browser
      }
    } catch (e: any) {
      setError(e.message ?? 'Google sign-in failed.');
    }
  }, [signInWithGoogle, setError]);

  return { request: ready, promptAsync };
}
