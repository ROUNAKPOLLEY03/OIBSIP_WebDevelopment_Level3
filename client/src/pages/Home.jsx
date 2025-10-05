import React, { useState, useEffect } from "react";
import {
  ChefHat,
  Zap,
  BarChart3,
  Users,
  Star,
  Truck,
  CreditCard,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [user, navigate]);

  const isAdmin = user?.role === "admin";

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "The best pizza builder I've ever used. So smooth and fun! 🔥",
      author: "Alex Rivera",
      rating: 5,
    },
    {
      text: "Payments were secure, and the delivery was super fast.",
      author: "Sarah Chen",
      rating: 5,
    },
    {
      text: "Finally, I can track my pizza in real-time. Love it!",
      author: "Marcus Johnson",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 146, 60, 0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Floating Pizza Elements */}
      <div className="absolute top-20 left-10 text-6xl animate-bounce opacity-20 hover:opacity-40 transition-opacity duration-300">
        🍕
      </div>
      <div className="absolute top-40 right-20 text-4xl animate-pulse opacity-20 hover:opacity-40 transition-opacity duration-300">
        🧀
      </div>
      <div
        className="absolute bottom-20 left-20 text-5xl animate-spin opacity-20 hover:opacity-40 transition-opacity duration-300"
        style={{ animationDuration: "8s" }}
      >
        🍄
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <span className="text-orange-600 text-sm font-semibold">
              ✨ Next-Gen Pizza Experience
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-4 hover:scale-105 transition-transform duration-300">
            <span className="text-orange-600 drop-shadow-lg">🍕 PizzaApp</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            {isAdmin
              ? "Manage your pizza empire with powerful AI-driven tools! 🚀"
              : "Your dream pizza, built your way with quantum flavor precision 🍕✨"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              isAdmin ? (
                <>
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="group inline-flex items-center px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    <BarChart3 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Admin Dashboard
                  </button>

                  <button
                    onClick={() => navigate("/admin/orders")}
                    className="group inline-flex items-center px-8 py-3 text-base font-medium rounded-lg text-orange-600 bg-white border-2 border-orange-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm"
                  >
                    <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Manage Orders
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="group inline-flex items-center px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
                  >
                    <ChefHat className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Go to Dashboard
                  </button>
                  <button onClick={() => navigate("/pizza-builder")} className="group inline-flex items-center px-8 py-3 text-base font-medium rounded-lg text-orange-600 bg-white border-2 border-orange-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm">
                    <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Build Pizza
                  </button>
                </>
              )
            ) : (
              <>
                <button className="inline-flex items-center px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                  Get Started
                </button>
                <button className="inline-flex items-center px-8 py-3 text-base font-medium rounded-lg text-orange-600 bg-white border-2 border-orange-600 hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm">
                  Sign In
                </button>
              </>
            )}
          </div>

          {isAuthenticated && (
            <div className="mt-6 animate-fade-in">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isAdmin
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {isAdmin
                  ? "👨‍💼 Admin Command Center"
                  : "🍕 Customer Portal Active"}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              {isAdmin ? "Why Admins Love Us ❤️" : "How It Works 🚀"}
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              {isAdmin
                ? "Designed to make running your pizza business smooth, efficient & profitable."
                : "Ordering your perfect pizza has never been this intuitive & delightful!"}
            </p>
          </div>

          {isAdmin ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast Order Processing",
                  desc: "Update order statuses in milliseconds with AI assistance, keeping customers delighted.",
                },
                {
                  icon: "📊",
                  title: "Smart Analytics Dashboard",
                  desc: "Get real-time insights on sales, revenue, trends & performance with predictive analytics.",
                },
                {
                  icon: "🤝",
                  title: "Deep Customer Intelligence",
                  desc: "Understand your customers' preferences, boost retention & maximize lifetime value.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 border border-orange-100"
                >
                  <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative max-w-5xl mx-auto">
              <div className="flex items-center justify-between relative">
                {[
                  {
                    icon: "🛠️",
                    title: "Build",
                    desc: "Choose base, sauce, cheese & premium toppings with infinite combinations.",
                  },
                  {
                    icon: "💳",
                    title: "Pay",
                    desc: "Checkout securely with Razorpay. Lightning-fast & encrypted.",
                  },
                  {
                    icon: "🚚",
                    title: "Enjoy",
                    desc: "Track your pizza's journey from oven to doorstep in real-time.",
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center w-1/3 group"
                  >
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl border border-orange-200">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm text-center leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}

                {/* Animated connector lines */}
                <div className="absolute top-10 left-[20%] right-[20%] h-1 bg-gradient-to-r from-orange-300 via-red-300 to-orange-300 animate-pulse opacity-60"></div>
              </div>
            </div>
          )}
        </div>

        {/* Testimonials Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-10 border border-orange-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            ⭐ What Our Legends Say
          </h2>

          <div className="relative h-32 overflow-hidden">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className={`absolute inset-0 text-center transition-all duration-700 ${
                  i === currentTestimonial
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic text-lg mb-3">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-orange-600">
                  — {testimonial.author}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  i === currentTestimonial
                    ? "bg-orange-500 scale-110"
                    : "bg-orange-200 hover:bg-orange-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pizza Gallery */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            🍕 Our Legendary Pizza Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Margherita Supreme",
                gradient: "from-red-200 to-red-400",
              },
              {
                name: "Pepperoni Blast",
                gradient: "from-orange-200 to-orange-400",
              },
              {
                name: "Veggie Paradise",
                gradient: "from-green-200 to-green-400",
              },
              {
                name: "Meat Lovers Deluxe",
                gradient: "from-amber-200 to-orange-400",
              },
            ].map((pizza, i) => (
              <div
                key={i}
                className="group relative h-40 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-500 cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${pizza.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-3xl mb-2 group-hover:scale-125 transition-transform duration-300">
                      🍕
                    </div>
                    <p className="font-semibold text-sm px-2">{pizza.name}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-20 bg-gradient-to-r from-orange-500 to-red-500 text-white py-16 px-8 rounded-2xl shadow-2xl text-center relative overflow-hidden transform hover:scale-105 transition-all duration-500">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 animate-pulse"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Taste Happiness? 🎉
            </h2>
            <p className="text-lg mb-6 opacity-95">
              Order now and get your favorite pizza delivered hot, fresh & fast!
            </p>
            <button className="group px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-orange-200">
              <span className="flex items-center gap-2">
                Build Your Pizza 🍕
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-10 border border-orange-100">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "How long does delivery take?",
                a: "Usually within 30-40 minutes depending on location and traffic.",
              },
              {
                q: "Do you support online payments?",
                a: "Yes! We use Razorpay for secure, encrypted payments with multiple options.",
              },
              {
                q: "Can I customize everything?",
                a: "Absolutely! From base to toppings, every ingredient is in your control.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="group p-4 rounded-lg hover:bg-orange-50 transition-colors duration-300 border border-transparent hover:border-orange-100"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                  {faq.q}
                </h3>
                <p className="text-gray-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
