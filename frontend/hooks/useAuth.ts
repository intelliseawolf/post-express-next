import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { useAppSelector } from "../store/hooks";

export default function useAuth(loading: boolean) {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      setAuthenticated(false);
      if (!["/login", "/register"].includes(router.route)) {
        router.replace("/login");
      }
    } else {
      setAuthenticated(true);
      if (["/login", "/register"].includes(router.route)) {
        router.replace("/");
      }
    }
  }, [currentUser, loading]);

  return authenticated;
}
