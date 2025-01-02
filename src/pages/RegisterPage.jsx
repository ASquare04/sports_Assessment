import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utility/firebase";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Registering...");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName,
      });

      toast.success("Registration successful!");
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
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white dark:bg-black shadow-lg rounded-lg p-6"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            Create an Account
          </h2>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-[#121212] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-[#121212] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-[#121212] dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register
          </button>
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 dark:text-blue-400 underline">
              Login
            </Link>
          </p>
        </form>
        <Toaster position="top-center" reverseOrder={false} />
      </div>
    </>
  );
};

export default Register;
