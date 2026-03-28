import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import StartAuth from "@/features/auth/signin/StartAuth";
import SignInPassword from "@/features/auth/signin/SignInPassword";
import ModeSwitch from "@/features/auth/components/ModeSwitch";
import NarrowPage from "@/components/common/NarrowPage.jsx";
import "./SignIn.css";

export default function SignIn({ questions, setQuestions }) {
  const location = useLocation();
  const [mode, setMode] = useState("password");

  const query = useMemo(() => location.search || "", [location.search]);

  return (
    <div className="signin-page">
      <div className="signin-topbar">
        <ModeSwitch mode={mode} onChange={setMode} />
      </div>

      <div className="signin-body">
        {mode === "password" ? (
          <SignInPassword query={query} />
        ) : (
            
              <StartAuth questions={questions} setQuestions={setQuestions} />
            
        )}
      </div>
    </div>
  );
}
