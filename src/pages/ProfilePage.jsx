import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

function ProfilePage() {
  const user = useUserStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">내 정보</h1>
      <div className="bg-base-100 shadow p-6 rounded w-full max-w-md">
        <p className="mb-2">
          <span className="font-semibold">ID:</span> {user.id}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Joined at:</span>{" "}
          {new Date(user.created_at).toLocaleDateString()}
        </p>
        {/* {user.user_metadata?.full_name && (
          <p className="mb-2">
            <span className="font-semibold">Name:</span>{" "}
            {user.user_metadata.full_name}
          </p>
        )} */}
        <button
          className="btn btn-error mt-4"
          onClick={() => {
            useUserStore.getState().clearUser();
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
