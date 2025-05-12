// "use client";

// import Image from "next/image";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useEffect, useState } from "react";
// import { useLoginMutation } from "../redux/features/auth/authApi";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { FaEnvelope, FaLock } from "react-icons/fa";
// import { FiEye, FiEyeOff } from "react-icons/fi";

// const schema = Yup.object().shape({
//   email: Yup.string()
//     .email("Invalid email!")
//     .required("Please enter your email!"),
//   password: Yup.string().required("Please enter your password!").min(6),
// });

// export default function Home() {
//   const [status, setStatus] = useState("Login");
//   const [showPassword, setShowPassword] = useState(false);
//   const [login, { isSuccess, error }] = useLoginMutation();
//   const router = useRouter();

//   const formik = useFormik({
//     initialValues: { email: "", password: "" },
//     validationSchema: schema,
//     onSubmit: async ({ email, password }) => {
//       await login({ email, password });
//     },
//   });

//   useEffect(() => {
//     if (isSuccess) {
//       toast.success("Login Successfully!");
//       router.push("/dashboard");
//     }
//     if (error && "data" in error) {
//       toast.error((error as any).data.message);
//     }
//   }, [isSuccess, error, router]);

//   return (
//     <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
//       <div className="p-6 w-[90%] md:w-[50%] lg:w-[40%] rounded-xl bg-white shadow-lg flex flex-col items-center">
//         <Image
//           src="/assets/loginPageLogo.png"
//           alt="Logo"
//           width={150}
//           height={150}
//         />
//         <h2 className="text-2xl font-semibold text-gray-700 mt-4">
//           Welcome Back
//         </h2>
//         <p className="text-gray-500 text-sm">Sign in to continue</p>

//         <form onSubmit={formik.handleSubmit} className="w-full mt-5">
//           <div className="w-full mb-4 relative">
//             <label className="text-sm text-gray-600">Email</label>
//             <div className="flex items-center border rounded-lg p-2 bg-gray-50">
//               <FaEnvelope className="text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 name="email"
//                 value={formik.values.email}
//                 onChange={formik.handleChange}
//                 placeholder="example@company.com"
//                 autoComplete="off"
//                 className="w-full bg-transparent outline-none"
//               />
//             </div>
//             {formik.errors.email && formik.touched.email && (
//               <span className="text-red-500 text-xs">
//                 {formik.errors.email}
//               </span>
//             )}
//           </div>

//           <div className="w-full mb-4 relative">
//             <label className="text-sm text-gray-600">Password</label>
//             <div className="flex items-center border rounded-lg p-2 bg-gray-50">
//               <FaLock className="text-gray-400 mr-2" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formik.values.password}
//                 onChange={formik.handleChange}
//                 autoComplete="off"
//                 placeholder="Enter your password"
//                 className="w-full bg-transparent outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <FiEyeOff className="text-gray-400" />
//                 ) : (
//                   <FiEye className="text-gray-400" />
//                 )}
//               </button>
//             </div>
//             {formik.errors.password && formik.touched.password && (
//               <span className="text-red-500 text-xs">
//                 {formik.errors.password}
//               </span>
//             )}
//           </div>

//           <div className="w-full flex justify-between text-sm text-gray-600">
//             <button
//               type="button"
//               onClick={() => setStatus(status === "Login" ? "fogpas" : "Login")}
//               className="underline"
//             >
//               {status === "Login" ? "Forgot password?" : "Back to login"}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
'use client';

import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { BiLogOut } from 'react-icons/bi';
import { IoIosAdd } from 'react-icons/io';
import { FaFilter } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { AiOutlineDashboard } from 'react-icons/ai';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthWrapper from '@/lib/AuthWrapper';

export default function Dashboard() {
  const router = useRouter();

  return (
    <Suspense>
      <AuthWrapper>
        <div className="flex h-screen w-full">
          {/* Sidebar */}

          {/* Main Content */}
          <main className="flex-1 flex flex-col p-6 overflow-y-auto">
            {/* Navbar */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <IoIosAdd size={22} /> Add Course
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                  <FaFilter size={20} /> Filters
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold">Total Students</h3>
                <p className="text-3xl font-bold">1,250</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold">Courses</h3>
                <p className="text-3xl font-bold">75</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold">Instructors</h3>
                <p className="text-3xl font-bold">25</p>
              </div>
            </motion.div>
          </main>

          <Button
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
        </div>
      </AuthWrapper>
    </Suspense>
  );
}
