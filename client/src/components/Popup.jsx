import React, { useEffect } from "react";

// Generic Popup Component with Modern Design
const Popup = ({
  isOpen,
  onClose,
  title,
  type = "default",
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  animation = "slideUp",
}) => {
  // Handle escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size configurations
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-4xl mx-4",
  };

  // Type configurations with modern styling
  const typeConfigs = {
    success: {
      accent: "from-emerald-400 via-green-400 to-teal-400",
      iconBg: "bg-gradient-to-br from-emerald-50 to-green-50",
      iconColor: "text-emerald-600",
      icon: "🎉",
    },
    error: {
      accent: "from-rose-400 via-red-400 to-pink-400",
      iconBg: "bg-gradient-to-br from-rose-50 to-red-50",
      iconColor: "text-rose-600",
      icon: "⚠️",
    },
    warning: {
      accent: "from-amber-400 via-yellow-400 to-orange-400",
      iconBg: "bg-gradient-to-br from-amber-50 to-yellow-50",
      iconColor: "text-amber-600",
      icon: "⚡",
    },
    info: {
      accent: "from-sky-400 via-blue-400 to-indigo-400",
      iconBg: "bg-gradient-to-br from-sky-50 to-blue-50",
      iconColor: "text-sky-600",
      icon: "ℹ️",
    },
    default: {
      accent: "from-slate-400 via-gray-400 to-zinc-400",
      iconBg: "bg-gradient-to-br from-slate-50 to-gray-50",
      iconColor: "text-slate-600",
      icon: "✨",
    },
  };

  const config = typeConfigs[type] || typeConfigs.default;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 popup-overlay"
      onClick={handleOverlayClick}
      style={{
        background: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        className={`
          relative w-full transform transition-all duration-500 ease-out
          ${sizeClasses[size]} 
          popup-container
          ${className}
        `}
        style={{
          animation: isOpen
            ? "popupSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        {/* Main Card */}
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20">
          {/* Gradient Accent Line */}
          <div className={`h-1 bg-gradient-to-r ${config.accent}`}></div>

          {/* Header */}
          {title && (
            <div className={`relative p-8 pb-4 ${headerClassName}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Icon */}
                  <div
                    className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                    ${config.iconBg} shadow-lg border border-white/50
                  `}
                  >
                    <span className={config.iconColor}>{config.icon}</span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                      {title}
                    </h3>
                  </div>
                </div>

                {/* Close Button */}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 hover:scale-110"
                    aria-label="Close popup"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div
            className={`px-8 pb-8 ${!title ? "pt-8" : ""} ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Success Popup
const SuccessPopup = ({
  isOpen,
  onClose,
  title = "Success!",
  children,
  ...props
}) => (
  <Popup
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    type="success"
    {...props}
  >
    {children}
  </Popup>
);

// Modern Error Popup
const ErrorPopup = ({
  isOpen,
  onClose,
  title = "Oops!",
  children,
  ...props
}) => (
  <Popup
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    type="error"
    {...props}
  >
    {children}
  </Popup>
);

// Modern Confirmation Popup
const ConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  ...props
}) => (
  <Popup isOpen={isOpen} onClose={onClose} title={title} type={type} {...props}>
    <div className="text-center space-y-6">
      {message && (
        <p className="text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      )}

      <div className="flex space-x-3 justify-center pt-4">
        <button
          onClick={onClose}
          className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          {confirmText}
        </button>
      </div>
    </div>
  </Popup>
);

// Premium Cart Success Popup
const CartSuccessPopup = ({
  isOpen,
  onClose,
  pizzaDetails,
  totalPrice,
  onViewCart,
  onContinueShopping,
}) => (
  <SuccessPopup
    isOpen={isOpen}
    onClose={onClose}
    title="Added to Cart!"
    size="md"
  >
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-6">
          Your delicious pizza is ready to order! 🍕
        </p>

        {/* Pizza Visual */}
        <div className="relative mx-auto mb-6 w-24 h-24">
          {/* Base */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-300 rounded-full shadow-lg border-4 border-yellow-400/50"></div>

          {/* Sauce */}
          <div className="absolute inset-2 bg-gradient-to-br from-red-400 to-red-500 rounded-full opacity-80"></div>

          {/* Cheese */}
          {pizzaDetails?.cheeses?.length > 0 && (
            <div className="absolute inset-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full opacity-90 border border-yellow-300/30"></div>
          )}

          {/* Toppings */}
          <div className="absolute inset-0 flex items-center justify-center">
            {pizzaDetails?.toppings?.slice(0, 4).map((topping, index) => (
              <span
                key={topping.id}
                className="text-lg absolute animate-pulse"
                style={{
                  transform: `rotate(${
                    index * 90
                  }deg) translateY(-12px) rotate(-${index * 90}deg)`,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {topping.image}
              </span>
            ))}
          </div>

          {/* Sparkle Effect */}
          <div className="absolute -top-2 -right-2 text-yellow-400 animate-spin text-xl">
            ✨
          </div>
        </div>
      </div>

      {/* Pizza Details Card */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100/80 shadow-sm">
        <h4 className="font-bold text-xl text-gray-800 mb-3 text-center">
          {pizzaDetails?.size?.name} {pizzaDetails?.crust?.name}
        </h4>

        <div className="space-y-2 text-center">
          <p className="text-gray-600">
            <span className="font-medium">Sauce:</span>{" "}
            {pizzaDetails?.sauce?.name}
          </p>

          {pizzaDetails?.cheeses?.length > 0 && (
            <p className="text-gray-600">
              <span className="font-medium">Cheese:</span>{" "}
              {pizzaDetails.cheeses.map((c) => c.name).join(", ")}
            </p>
          )}

          {pizzaDetails?.toppings?.length > 0 && (
            <p className="text-gray-600">
              <span className="font-medium">Toppings:</span>{" "}
              {pizzaDetails.toppings.map((t) => t.name).join(", ")}
            </p>
          )}
        </div>

        {/* Price Highlight */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">Total:</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              ₹{totalPrice}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={() => {
            onClose();
            onContinueShopping?.();
          }}
          className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300 active:scale-95"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>Continue Shopping</span>
            <span className="text-xl">🛒</span>
          </span>
        </button>

        <button
          onClick={() => {
            onClose();
            onViewCart?.();
          }}
          className="w-full border-2 border-orange-300 text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:border-orange-400 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>View Cart & Checkout</span>
            <span className="text-xl">→</span>
          </span>
        </button>
      </div>
    </div>
  </SuccessPopup>
);

// Usage Example Component
const PopupShowcase = () => {
  const [activePopup, setActivePopup] = React.useState(null);

  const mockPizzaDetails = {
    size: { name: "Large" },
    crust: { name: "Thin Crust" },
    sauce: { name: "Marinara" },
    cheeses: [{ name: "Mozzarella" }, { name: "Parmesan" }],
    toppings: [
      { id: 1, name: "Pepperoni", image: "🍕" },
      { id: 2, name: "Mushrooms", image: "🍄" },
      { id: 3, name: "Bell Peppers", image: "🫑" },
    ],
  };

  const closePopup = () => setActivePopup(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Professional Popup Gallery
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => setActivePopup("success")}
            className="bg-gradient-to-br from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-3xl mb-2">✅</div>
            Success Popup
          </button>

          <button
            onClick={() => setActivePopup("error")}
            className="bg-gradient-to-br from-rose-400 to-red-500 hover:from-rose-500 hover:to-red-600 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-3xl mb-2">⚠️</div>
            Error Popup
          </button>

          <button
            onClick={() => setActivePopup("warning")}
            className="bg-gradient-to-br from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-3xl mb-2">⚡</div>
            Warning Popup
          </button>

          <button
            onClick={() => setActivePopup("info")}
            className="bg-gradient-to-br from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-3xl mb-2">ℹ️</div>
            Info Popup
          </button>

          <button
            onClick={() => setActivePopup("confirmation")}
            className="bg-gradient-to-br from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-3xl mb-2">❓</div>
            Confirmation
          </button>

          <button
            onClick={() => setActivePopup("cart")}
            className="bg-gradient-to-br from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-semibold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <div className="text-3xl mb-2">🛒</div>
            Cart Success
          </button>
        </div>

        {/* Popups */}
        <SuccessPopup
          isOpen={activePopup === "success"}
          onClose={closePopup}
          title="Payment Successful!"
        >
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-600">
              Your order has been confirmed and will be delivered soon!
            </p>
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-green-800 font-medium">Order ID: #PZ12345</p>
            </div>
          </div>
        </SuccessPopup>

        <ErrorPopup
          isOpen={activePopup === "error"}
          onClose={closePopup}
          title="Connection Failed"
        >
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-600">
              Unable to connect to our servers. Please check your internet
              connection.
            </p>
            <button
              onClick={closePopup}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </ErrorPopup>

        <ConfirmationPopup
          isOpen={activePopup === "confirmation"}
          onClose={closePopup}
          onConfirm={() => {
            alert("Item deleted!");
            closePopup();
          }}
          title="Delete Item?"
          message="This action cannot be undone. The item will be permanently removed from your cart."
          confirmText="Delete"
          cancelText="Keep It"
        />

        <CartSuccessPopup
          isOpen={activePopup === "cart"}
          onClose={closePopup}
          pizzaDetails={mockPizzaDetails}
          totalPrice="599.00"
          onViewCart={() => alert("Navigate to cart")}
          onContinueShopping={() => alert("Continue shopping")}
        />
      </div>
    </div>
  );
};

// CSS Styles (add to your global CSS or styled-components)
const popupStyles = `
  @keyframes popupSlideUp {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .popup-overlay {
    animation: fadeIn 0.3s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Glass morphism effect */
  .popup-container::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 1px;
    background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
  }

  /* Enhance backdrop blur for better browser support */
  @supports not (backdrop-filter: blur(12px)) {
    .popup-overlay {
      background: rgba(0, 0, 0, 0.8);
    }
  }
`;

export {
  Popup,
  SuccessPopup,
  ErrorPopup,
  ConfirmationPopup,
  CartSuccessPopup,
  PopupShowcase,
  popupStyles,
};
