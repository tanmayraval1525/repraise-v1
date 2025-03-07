import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const GoogleAuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { access_token } = router.query;

    if (access_token) {
      // Store the token in cookies or local storage
      if (typeof access_token === 'string') {
        Cookies.set("access_token", access_token, { expires: 1 }); // Expires in 1 day
      }
      router.replace("/home"); // Redirect to the home page and remove the token from the URL
    }
  }, [router]);

  return <div>Loading...</div>;
};

export default GoogleAuthPage;