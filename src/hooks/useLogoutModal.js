import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLogoutModal = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userToLogout, setUserToLogout] = useState(null);

  const openLogoutModal = (user) => {
    setUserToLogout(user);
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
    setUserToLogout(null);
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsLogoutModalOpen(false);
    setUserToLogout(null);
    navigate("/");
  };

  return {
    isLogoutModalOpen,
    userToLogout,
    openLogoutModal,
    closeLogoutModal,
    confirmLogout,
  };
};
