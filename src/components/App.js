import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";

function App() {
  const [initialized, setInitialized] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        // setIsLoggedIn(true);
        setUserObj(user);
      }
      setInitialized(true);
    });
  }, []);

  return (
    <>
      {initialized ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initialized..."
      )}
      <footer>&copy {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
