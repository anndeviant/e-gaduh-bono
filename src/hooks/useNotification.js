import { useState, useCallback } from "react";

const useNotification = () => {
  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
    autoClose: true,
    duration: 5000,
  });

  const showNotification = useCallback(
    ({
      type = "success",
      title,
      message,
      autoClose = true,
      duration = 5000,
    }) => {
      setNotification({
        isVisible: true,
        type,
        title,
        message,
        autoClose,
        duration,
      });
    },
    []
  );

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  // Helper functions for common notification types
  const showSuccess = useCallback(
    (title, message) => {
      showNotification({ type: "success", title, message });
    },
    [showNotification]
  );

  const showError = useCallback(
    (title, message) => {
      showNotification({ type: "error", title, message });
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (title, message) => {
      showNotification({ type: "warning", title, message });
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (title, message) => {
      showNotification({ type: "info", title, message });
    },
    [showNotification]
  );

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useNotification;
