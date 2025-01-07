import { useState, useEffect } from "react";
import { AxiosGet } from "../api";

const useCurrentUser = () => {
  const token = localStorage.getItem("authToken");

  const [currentUser, setCurrentUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      AxiosGet(`/accounts/${userId}`)
        .then((response) => {
          if (response.status === 200) {
            setCurrentUser(response.data);
            setIsLoggedIn(true);
          }
        })
        .catch((error) => {
          if (error?.response?.status === 401) {
            setCurrentUser({});
            localStorage.removeItem("authToken");
            localStorage.removeItem("id");
            setIsLoggedIn(false);
          }
        });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentUser({});
  };

  return { currentUser, isLoggedIn, setIsLoggedIn, logout };
};

export default useCurrentUser;
