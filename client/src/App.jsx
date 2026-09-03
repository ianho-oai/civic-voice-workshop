import { useState } from "react";
import { Header } from "./components/Header";
import { AdminPage } from "./pages/AdminPage";
import { CitizenPage } from "./pages/CitizenPage";
import { LoginPage } from "./pages/LoginPage";

const sessionStorageKey = "civicvoice-session";

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(sessionStorageKey));
  } catch {
    localStorage.removeItem(sessionStorageKey);
    return null;
  }
}

export default function App() {
  const [session, setSession] = useState(loadSession);

  function handleLogin(nextSession) {
    localStorage.setItem(sessionStorageKey, JSON.stringify(nextSession));
    setSession(nextSession);
  }

  function handleLogout() {
    localStorage.removeItem(sessionStorageKey);
    setSession(null);
  }

  return (
    <>
      <Header user={session?.user} onLogout={handleLogout} />
      {!session && <LoginPage onLogin={handleLogin} />}
      {session?.user.role === "citizen" && <CitizenPage user={session.user} />}
      {session?.user.role === "admin" && <AdminPage user={session.user} />}
    </>
  );
}
