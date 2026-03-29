import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import Feed            from "./pages/Feed";
import Explore         from "./pages/Explore";
import Profile         from "./pages/Profile";
import Messages        from "./pages/Messages";
import Notifications   from "./pages/Notifications";
import PostDetail      from "./pages/PostDetail";
import Login           from "./pages/Login";
import Signup          from "./pages/Signup";
import ForgotPassword  from "./pages/ForgotPassword";
import ResetPassword   from "./pages/ResetPassword";
import VerifyEmail     from "./pages/VerifyEmail";
import CreatePost      from "./pages/CreatePost";
import EditProfile     from "./pages/EditProfile";
import Saved           from "./pages/Saved";
import Settings        from "./pages/Settings";
import FollowersList   from "./pages/FollowersList";
import FollowingList   from "./pages/FollowingList";

// Loading spinner
function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
      <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return !user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public (auth) routes */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/login"            element={<Login />} />
        <Route path="/signup"           element={<Signup />} />
        <Route path="/forgot-password"  element={<ForgotPassword />} />
        <Route path="/reset-password"   element={<ResetPassword />} />
      </Route>

      {/* Semi-public (no auth required, but nice if logged in) */}
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Private routes — all inside the main layout */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/"                            element={<Feed />} />
        <Route path="/explore"                     element={<Explore />} />
        <Route path="/profile/:username"           element={<Profile />} />
        <Route path="/profile/:username/followers" element={<FollowersList />} />
        <Route path="/profile/:username/following" element={<FollowingList />} />
        <Route path="/messages"                    element={<Messages />} />
        <Route path="/messages/:conversationId"    element={<Messages />} />
        <Route path="/notifications"               element={<Notifications />} />
        <Route path="/p/:postId"                   element={<PostDetail />} />
        <Route path="/create"                      element={<CreatePost />} />
        <Route path="/edit-profile"                element={<EditProfile />} />
        <Route path="/saved"                       element={<Saved />} />
        <Route path="/settings"                    element={<Settings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
