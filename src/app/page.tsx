"use client";

import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useLoginMutation } from "../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

export default function Home() {
  const [status, setStatus] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isSuccess, error }] = useLoginMutation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully!");
      router.push("/dashboard");
    }
    if (error && "data" in error) {
      toast.error((error as any).data.message);
    }
  }, [isSuccess, error, router]);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 w-[90%] md:w-[50%] lg:w-[40%] rounded-xl bg-white shadow-lg flex flex-col items-center">
        <Image
          src="/assets/loginPageLogo.png"
          alt="Logo"
          width={150}
          height={150}
        />
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-sm">Sign in to continue</p>

        <form onSubmit={formik.handleSubmit} className="w-full mt-5">
          <div className="w-full mb-4 relative">
            <label className="text-sm text-gray-600">Email</label>
            <div className="flex items-center border rounded-lg p-2 bg-gray-50">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="text"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                placeholder="example@company.com"
                autoComplete="off"
                className="w-full bg-transparent outline-none"
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <span className="text-red-500 text-xs">
                {formik.errors.email}
              </span>
            )}
          </div>

          <div className="w-full mb-4 relative">
            <label className="text-sm text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg p-2 bg-gray-50">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                autoComplete="off"
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FiEyeOff className="text-gray-400" />
                ) : (
                  <FiEye className="text-gray-400" />
                )}
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-500 text-xs">
                {formik.errors.password}
              </span>
            )}
          </div>

          <div className="w-full flex justify-between text-sm text-gray-600">
            <button
              type="button"
              onClick={() => setStatus(status === "Login" ? "fogpas" : "Login")}
              className="underline"
            >
              {status === "Login" ? "Forgot password?" : "Back to login"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
