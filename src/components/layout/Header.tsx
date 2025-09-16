import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../common/Button";

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    window.location.href = "/login";
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="app-title">GameScore Pro</h1>
        </div>

        <div className="header-right">
          {user && (
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">
                  Welcome, {user.name || user.preferred_username}!
                </span>
                <span className="user-email">{user.email}</span>
              </div>

              <Button
                onClick={handleSignOut}
                variant="secondary"
                size="small"
                className="sign-out-btn"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
