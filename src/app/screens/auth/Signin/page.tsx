"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    const success = login(data.email.toLowerCase(), data.password);
    if (!success) {
      alert("Invalid email or password");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center min-h-screen bg-[#0b1130] text-white"
    >
      <div className="bg-[#14213d] p-8 rounded w-96">
        <h1 className="text-xl mb-4">Sign In</h1>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 mb-2 rounded text-black"
        />
        <p>{errors.email?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full p-2 mb-2 rounded text-black"
        />
        <p>{errors.password?.message}</p>

        <button type="submit" className="w-full bg-blue-500 py-2 rounded">
          Sign In
        </button>
        <p className="text-sm mt-4">
          Create an account?
          <a href="/screens/auth/Signup" className="text-blue-400 underline">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
}
