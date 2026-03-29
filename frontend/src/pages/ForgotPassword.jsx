import { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../api/endpoints";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const [sent, setSent] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); if (!email) return; setLoading(true); try { await authAPI.forgotPassword(email); setSent(true); toast.success("Reset email sent!"); } catch {} finally { setLoading(false); } };
  if (sent) return <div className="text-center"><div className="text-4xl mb-4">📧</div><h2 className="font-bold text-xl mb-2">Check your email</h2><p className="text-gray-500 text-sm mb-4">We sent a password reset link to <strong>{email}</strong></p><Link to="/login" className="text-primary-500 hover:underline text-sm">Back to sign in</Link></div>;
  return <div><h2 className="text-xl font-bold mb-2">Forgot password?</h2><p className="text-sm text-gray-500 mb-6">Enter your email and we'll send you a reset link.</p><form onSubmit={handleSubmit} className="space-y-4"><Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /><Button type="submit" loading={loading} className="w-full">Send reset link</Button></form><p className="text-center text-sm text-gray-500 mt-4"><Link to="/login" className="text-primary-500 hover:underline">Back to sign in</Link></p></div>;
}
