import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/endpoints";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false);
  const token = params.get("token");
  const handleSubmit = async (e) => { e.preventDefault(); if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; } setLoading(true); try { await authAPI.resetPassword({ token, newPassword: password }); toast.success("Password reset! Please log in."); navigate("/login"); } catch {} finally { setLoading(false); } };
  return <div><h2 className="text-xl font-bold mb-2">Reset password</h2><p className="text-sm text-gray-500 mb-6">Enter your new password.</p><form onSubmit={handleSubmit} className="space-y-4"><Input label="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /><Button type="submit" loading={loading} className="w-full">Reset password</Button></form></div>;
}
