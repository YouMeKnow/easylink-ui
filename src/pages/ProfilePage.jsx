import AuthGuard from "@/features/auth/AuthGuard";
import Profile from "@/features/profile/Profile";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  );
}