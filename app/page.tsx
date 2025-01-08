"use client";

import Image from "next/image";
import Logo from "../public/assets/loginPageLogo.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { styles } from "./styles/style";
import { useEffect, useState } from "react";
import { useLoginMutation } from "../redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Providers } from "./Provider";
import Protected from "./hooks/useProtected";
import { useSelector } from "react-redux";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email!")
    .required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

export default function Home() {
  const [status, setStatus] = useState("Login");
  const [login, { isSuccess, data, error }] = useLoginMutation();
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
      toast.success("Login Succeessfully!");
      router.push("/learning/trainings");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, router]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    // <Protected>
    <div className="h-screen w-screen bg-login-bg-img bg-no-repeat bg-cover flex justify-center items-center">
      <div className="p-6 w-[45%] rounded-md bg-slate-100 flex flex-col md:flex-row items-center justify-center bg-main-bg-img bg-no-repeat bg-cover">
        <div className="w-[50%] flex justify-center items-center p-8">
          <Image src={Logo} alt="Logo" width="220" height="220" />
        </div>
        <div className="flex justify-center items-center flex-col">
          {status === "Login" ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="w-full">
                  <label className="text-[16px] font-sans text-gray-400 font-[500]">
                    Enter your email
                  </label>
                  <input
                    type="text"
                    name=""
                    value={values.email}
                    onChange={handleChange}
                    placeholder="example@company.com"
                    autoComplete="off"
                    className={`${
                      errors.email && touched.email && "border-red-500"
                    } ${styles.input}`}
                    id="email"
                  />
                  {errors.email && touched.email && (
                    <span className="text-red-500 pt-2 block">
                      {errors.email}
                    </span>
                  )}
                </div>
                <div className="w-full mt-10">
                  <label className="text-[16px] font-sans text-gray-400 font-[500]">
                    Enter your password
                  </label>
                  <input
                    type="password"
                    name=""
                    value={values.password}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="....."
                    className={`${
                      errors.password && touched.password && "border-red-500"
                    } ${styles.input}`}
                    id="password"
                  />
                  {errors.password && touched.password && (
                    <span className="text-red-500 pt-2 block">
                      {errors.password}
                    </span>
                  )}
                </div>
                <div className="mt-5 w-full flex justify-center items-center">
                  <button type="submit" className={`${styles.button}`}>
                    {" "}
                    Login{" "}
                  </button>
                </div>
              </form>
              <div className="mt-5 w-full flex justify-center items-center">
                <button onClick={() => setStatus("fogpas")}>
                  <p className="text-sm underline text-[#00000099] font-[600]">
                    I forgot my password
                  </p>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="w-full">
                <label className="text-[16px] font-sans text-gray-400 font-[500]">
                  Enter your email
                </label>
                <input
                  type="text"
                  name=""
                  value={values.email}
                  onChange={handleChange}
                  placeholder="example@company.com"
                  autoComplete="off"
                  className={`${
                    errors.email && touched.email && "border-red-500"
                  } ${styles.input}`}
                  id="email"
                />
              </div>

              <div className="mt-5 w-full flex justify-center items-center">
                <button type="submit" className={`${styles.button}`}>
                  {" "}
                  Send Verification Code{" "}
                </button>
              </div>
              <div className="mt-5 w-full flex justify-center items-center">
                <button onClick={() => setStatus("Login")}>
                  <p className="text-sm underline text-[#00000099] font-[600]">
                    Back to login
                  </p>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
