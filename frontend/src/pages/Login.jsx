import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { await login(form.email, form.password); navigate("/"); toast.success("Welcome back! 👋"); }
    catch (err) { setErrors({ form: err.response?.data?.message || "Login failed" }); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Sign in</h2>
      {errors.form && <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl mb-4">{errors.form}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} error={errors.email} />
        <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} error={errors.password} />
        <div className="text-right"><Link to="/forgot-password" className="text-sm text-primary-500 hover:underline">Forgot password?</Link></div>
        <Button type="submit" loading={loading} className="w-full">Sign in</Button>
      </form>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">Don't have an account? <Link to="/signup" className="text-primary-500 font-semibold hover:underline">Sign up</Link></p>
    </div>
  );
}
