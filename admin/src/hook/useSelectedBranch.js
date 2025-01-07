import { useState, useEffect } from "react";

const useSelectedBranch = () => {
  const [selectedBranch, setSelectedBranch] = useState(() => {
    // Initialize state from localStorage (if available)
    const savedBranch = localStorage.getItem("selectedBranch");
    return savedBranch ? JSON.parse(savedBranch) : null;
  });

  useEffect(() => {
    // Effect to sync localStorage when selectedBranch changes
    if (selectedBranch !== null) {
      localStorage.setItem("selectedBranch", JSON.stringify(selectedBranch));
    }
  }, [selectedBranch]); // This will run every time selectedBranch changes

  useEffect(() => {
    // Event listener to detect changes in localStorage from other tabs
    const handleStorageChange = () => {
      const savedBranch = localStorage.getItem("selectedBranch");

      setSelectedBranch(savedBranch ? JSON.parse(savedBranch) : null);
    };

    // Listen for changes to localStorage (across different tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  return { selectedBranch, setSelectedBranch };
};

export default useSelectedBranch;
