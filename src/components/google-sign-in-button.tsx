const login = useGoogleLogin({
  flow: "implicit", // Or auth-code depending on setup
  onSuccess: async (tokenResponse) => {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    });

    const userData = await response.json();
    localStorage.setItem("el_user", JSON.stringify(userData));
    window.location.href = "/dashboard";
  },
  onError: (error) => console.error("Google Auth Failed:", error),
});
