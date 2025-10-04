"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup.string().optional(),
});

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Signup failed");
        return;
      }

      alert("Signup successful!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center min-h-screen bg-[#0b1130] text-white"
    >
      <div className="bg-[#14213d] p-8 rounded w-96">
        <h1 className="text-xl mb-4">Sign Up</h1>

        <input
          {...register("firstName")}
          placeholder="First Name"
          className="w-full p-2 mb-1 rounded text-black"
        />
        <p className="text-red-400 text-sm">{errors.firstName?.message}</p>

        <input
          {...register("lastName")}
          placeholder="Last Name"
          className="w-full p-2 mb-1 rounded text-black"
        />
        <p className="text-red-400 text-sm">{errors.lastName?.message}</p>

        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 mb-1 rounded text-black"
        />
        <p className="text-red-400 text-sm">{errors.email?.message}</p>

        <input
          {...register("username")}
          placeholder="Username"
          className="w-full p-2 mb-1 rounded text-black"
        />
        <p className="text-red-400 text-sm">{errors.username?.message}</p>

        {/* Password */}
        <div className="relative w-full mb-1">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Password"
            className="w-full p-2 rounded text-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-xs text-blue-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-red-400 text-sm">{errors.password?.message}</p>

        {/* Confirm Password */}
        <div className="relative w-full mb-1">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className="w-full p-2 rounded text-black"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 top-2 text-xs text-blue-600"
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
        <p className="text-red-400 text-sm">
          {errors.confirmPassword?.message}
        </p>

        <input
          {...register("phone")}
          placeholder="Phone (optional)"
          className="w-full p-2 mb-1 rounded text-black"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 py-2 rounded mt-2 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Continue"}
        </button>

        <p className="text-sm mt-4">
          Have an account?{" "}
          <a href="/screens/auth/Signin" className="text-blue-400 underline">
            Login
          </a>
        </p>
      </div>
    </form>
  );
}
