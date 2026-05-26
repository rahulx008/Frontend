const Button = ({ children, onClick, variant = "default" }) => {
  const baseClasses = "px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  const variantClasses = {
    default: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-green-500 text-white hover:bg-green-600"
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;