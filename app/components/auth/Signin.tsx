// components/auth/SignIn.tsx

import Link from "next/link";
import Header from "../landingPage/Header";  // Adjust the path based on your folder structure
import Footer from "../landingPage/Footer";  // Adjust the path based on your folder structure
import { Github, LogIn } from "lucide-react";  // Using lucide-react icons, replace if you have logos

const SignIn = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
          <Header/>
      <div className="flex items-center justify-center py-16 px-4 mt-16 flex-1">
        <div className="max-w-lg w-full bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Sign In</h2>

          {/* Google and GitHub Login Placeholder */}
          <div className="flex gap-4 mb-6">
            <button className="w-full px-4 py-2 md:py-3 md:px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center space-x-2">
              <LogIn className="h-5 w-5" />
              <span className="hidden md:inline">Sign in with Google</span>
            </button>
            <button className="w-full px-4 py-2 md:py-3 md:px-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition flex items-center justify-center space-x-2">
              <Github className="h-5 w-5" />
              <span className="hidden md:inline">Sign in with GitHub</span>
            </button>
          </div>

          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                className="w-full p-4 border border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                className="w-full p-4 border border-gray-300 rounded-xl mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SignIn;
