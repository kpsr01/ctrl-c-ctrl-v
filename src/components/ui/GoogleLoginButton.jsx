import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage({ onLogin }) {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/forms.body',
    onSuccess: tokenResponse => {
      console.log('Access Token:', tokenResponse.access_token);
      setLoading(false);
      onLogin(tokenResponse.access_token);
    },
    onError: () => {
      alert('Login Failed');
      setLoading(false);
    },
    onRequest: () => {
      setLoading(true);
    },
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-8 py-10 shadow-lg max-w-md w-full text-center">
        <div className="text-4xl mb-3">   </div>

        <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
        <p className="text-gray-300 mb-6">Sign in to continue using the app</p>

        <button
          onClick={() => login()}
          disabled={loading}
          className="flex items-center justify-center gap-3 px-5 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-100 transition w-full"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <p className="text-sm text-gray-500 mt-10">@CtrlC+CtrlV </p>
      </div>
    </div>
  );
}
