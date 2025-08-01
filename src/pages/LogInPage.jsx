import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Import the GoogleLoginButton component

export default function LoginPage() {
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "YOUR_CLIENT_ID_HERE", // Replace with your Google client ID
        callback: (response) => {
          console.log("Google Sign-In response:", response);
          setIdToken(response.credential);
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );

      // Optionally: prompt the user automatically
      // window.google.accounts.id.prompt();
    }
  }, []);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Sign in with Google</h1>
      <div id="google-signin-button"></div>

      {idToken && (
        <div style={{ marginTop: 20 }}>
          <strong>ID Token:</strong>
          <pre style={{ whiteSpace: "break-spaces" }}>{idToken}</pre>
        </div>
      )}
    </div>
  );
}
