import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import { 
  PersonIcon, EnvelopeClosedIcon, LockClosedIcon, 
  ImageIcon, EyeClosedIcon, EyeOpenIcon 
} from "@radix-ui/react-icons";
import toast from "react-hot-toast";

export default function Signup() {
  const { register, handleSubmit } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarName, setAvatarName] = useState("");
  const [coverName, setCoverName] = useState("");

  const handleSignup = async (data) => {
    setError("");
    setLoading(true);

    if (!data.avatar || data.avatar.length === 0) {
      toast.error("Avatar image is required");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    if (data.coverImage && data.coverImage.length > 0) {
      formData.append("coverImage", data.coverImage[0]);
    }

    try {
      await registerUser(formData);
      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main text-text-main relative overflow-hidden py-10 text-left transition-colors duration-200">
      {/* Background Shapes */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-primary/5 rotate-45 rounded-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-40 w-96 h-96 bg-primary/5 rotate-45 rounded-3xl pointer-events-none"></div>
      <div className="absolute top-40 right-0 w-72 h-72 bg-primary/5 rotate-45 rounded-3xl pointer-events-none"></div>

      <form onSubmit={handleSubmit(handleSignup)} className="relative z-10 w-[440px] px-4">
        {/* Signup Card */}
        <div className="bg-surface border border-border-main rounded-2xl shadow-2xl p-8">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-center mb-2 text-text-main tracking-tight">
            Sign Up
          </h1>
          <p className="text-center text-sm text-text-sub mb-8">
            Create your account to start streaming
          </p>

          {error && (
            <div className="bg-danger/10 text-danger text-xs p-3 rounded-lg border border-danger/20 mb-6 text-center">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="text-left mt-3">
            <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Full Name</label>
          </div>
          <div className="flex items-center border-b border-border-main py-2.5 mb-5 focus-within:border-primary transition-colors">
            <PersonIcon className="text-text-muted mr-3 h-4 w-4" />
            <input
              type="text"
              required
              {...register("fullname")}
              placeholder="Enter your full name"
              className="w-full outline-none text-sm text-text-main placeholder-text-muted bg-transparent"
            />
          </div>

          {/* Username */}
          <div className="text-left">
            <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Username</label>
          </div>
          <div className="flex items-center border-b border-border-main py-2.5 mb-5 focus-within:border-primary transition-colors">
            <PersonIcon className="text-text-muted mr-3 h-4 w-4" />
            <input
              type="text"
              required
              {...register("username")}
              placeholder="Choose a username"
              className="w-full outline-none text-sm text-text-main placeholder-text-muted bg-transparent"
            />
          </div>

          {/* Email */}
          <div className="text-left">
            <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Email Address</label>
          </div>
          <div className="flex items-center border-b border-border-main py-2.5 mb-5 focus-within:border-primary transition-colors">
            <EnvelopeClosedIcon className="text-text-muted mr-3 h-4 w-4" />
            <input
              type="email"
              required
              {...register("email")}
              placeholder="Type your email"
              className="w-full outline-none text-sm text-text-main placeholder-text-muted bg-transparent"
            />
          </div>

          {/* Password */}
          <div className="text-left">
            <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Password</label>
          </div>
          <div className="flex items-center border-b border-border-main py-2.5 mb-5 focus-within:border-primary transition-colors">
            <LockClosedIcon className="text-text-muted mr-3 h-4 w-4" />
            <input
              type={showPassword ? "text" : "password"}
              required
              {...register("password")}
              placeholder="Create a strong password"
              className="w-full outline-none text-sm text-text-main placeholder-text-muted bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-text-sub hover:text-text-main transition cursor-pointer"
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>

          {/* Avatar Upload (Required) */}
          <div className="text-left">
            <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Avatar Image <span className="text-danger">*</span></label>
          </div>
          <div className="flex items-center border-b border-border-main py-2.5 mb-5 focus-within:border-primary transition-colors">
            <ImageIcon className="text-text-muted mr-3 h-4 w-4" />
            <label className="w-full text-sm text-text-muted cursor-pointer hover:text-text-secondary transition truncate">
              {avatarName || "Choose profile avatar image..."}
              <input
                type="file"
                required
                accept="image/*"
                {...register("avatar", {
                  onChange: (e) => setAvatarName(e.target.files[0]?.name || "")
                })}
                className="hidden"
              />
            </label>
          </div>

          {/* Cover Image Upload (Optional) */}
          <div className="text-left">
            <label className="text-xs font-semibold text-text-sub uppercase tracking-wider">Cover Banner (Optional)</label>
          </div>
          <div className="flex items-center border-b border-border-main py-2.5 mb-6 focus-within:border-primary transition-colors">
            <ImageIcon className="text-text-muted mr-3 h-4 w-4" />
            <label className="w-full text-sm text-text-muted cursor-pointer hover:text-text-secondary transition truncate">
              {coverName || "Choose optional cover banner..."}
              <input
                type="file"
                accept="image/*"
                {...register("coverImage", {
                  onChange: (e) => setCoverName(e.target.files[0]?.name || "")
                })}
                className="hidden"
              />
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-lg active:scale-95 disabled:opacity-50 transition duration-150 flex justify-center items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Registering...
              </>
            ) : (
              "SIGN UP"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center mt-6 text-xs text-text-sub">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-semibold">
              Login here
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}