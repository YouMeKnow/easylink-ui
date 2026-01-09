import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import SignUpMemoryLocks from "./SignUpMemoryLocks";
import SignUpPassword from "./SignUpPassword";
import ModeSwitch from "@/features/auth/components/ModeSwitch"; 
import "./SignUp.css";

export default function SignUp() {
  const location = useLocation();
  const [mode, setMode] = useState("password");

  const query = useMemo(() => location.search || "", [location.search]);

  return (
    <div className="signup-page">
      <div className="signup-topbar">
        <ModeSwitch mode={mode} onChange={setMode} />
      </div>

      <div className="signup-body">
        {mode === "password" ? (
          <SignUpPassword query={query} />
        ) : (
          <SignUpMemoryLocks query={query} />
        )}
      </div>
    </div>
  );
}
