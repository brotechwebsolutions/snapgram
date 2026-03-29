import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3) e.username = "Username must be at least 3 characters";
    if (!form.email) e.email = "Email is required";
    if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { await signup(form); navigate("/"); toast.success("Welcome to SnapGram! 🎉"); }
    catch (err) { setErrors({ form: err.response?.data?.message || "Signup failed" }); }
    finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}));

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create account</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign up to see photos from your friends.</p>
      {errors.form && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{errors.form}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" placeholder="Alex Morgan" value={form.fullName} onChange={set("fullName")} />
        <Input label="Username" placeholder="alex.dev" value={form.username} onChange={set("username")} error={errors.username} />
        <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} error={errors.email} />
        <Input label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={set("password")} error={errors.password} />
        <Button type="submit" loading={loading} className="w-full">Create account</Button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">Already have an account? <Link to="/login" className="text-primary-500 font-semibold hover:underline">Sign in</Link></p>
    </div>
  );
}
