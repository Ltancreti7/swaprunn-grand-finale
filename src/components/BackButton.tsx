import { useLocation } from "react-router-dom";

const BackButton = () => {
  const location = useLocation();
  
  // Don't show back button on homepage
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="text-sm text-red-600 font-semibold inline-block mb-6 hover:text-red-700 hover:underline mt-4 ml-4"
    >
      ← Back
    </button>
  );
};

export default BackButton;