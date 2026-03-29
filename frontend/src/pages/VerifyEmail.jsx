import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authAPI } from "../api/endpoints";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("loading");
  useEffect(() => { const t = params.get("token"); if (t) authAPI.verifyEmail(t).then(() => setStatus("success")).catch(() => setStatus("error")); else setStatus("error"); }, []);
  if (status === "loading") return <div className="text-center py-8"><div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p>Verifying your email…</p></div>;
  if (status === "success") return <div className="text-center"><div className="text-5xl mb-4">✅</div><h2 className="text-xl font-bold mb-2">Email verified!</h2><p className="text-gray-500 text-sm mb-4">Your account is now active.</p><Link to="/" className="btn-primary">Go to SnapGram</Link></div>;
  return <div className="text-center"><div className="text-5xl mb-4">❌</div><h2 className="text-xl font-bold mb-2">Verification failed</h2><p className="text-gray-500 text-sm mb-4">This link may be expired or invalid.</p><Link to="/login" className="text-primary-500 hover:underline text-sm">Back to login</Link></div>;
}
