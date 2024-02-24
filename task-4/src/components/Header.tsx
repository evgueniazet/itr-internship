import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <Button onClick={handleLogout} variant="contained" color="primary">
        Logout
      </Button>
    </div>
  );
};

export default Header;
