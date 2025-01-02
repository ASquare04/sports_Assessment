import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utility/firebase";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { Toaster, toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Logging in...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-cover flex items-center justify-center bg-gray-100 dark:bg-[#121212]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white dark:bg-black shadow-lg rounded-lg p-6"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Welcome Back!
          </h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-[#121212] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-[#121212] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-3 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Login
          </button>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 underline">
              Create one
            </Link>
          </p>
        </form>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Login;
