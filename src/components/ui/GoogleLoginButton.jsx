import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';  

export default function GoogleLoginButton({ onLogin }) {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/forms.body',
    onSuccess: tokenResponse => {
      console.log('Access Token:', tokenResponse.access_token);
      onLogin(tokenResponse.access_token); // Pass OAuth access token to parent
    },
    onError: () => {
      alert('Login Failed');
    },
  });

  return (
    <button onClick={() => login()}>
      Sign in with Google
    </button>
  );
}
