import { Link } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function NotAllowed() {
  return (
    <div className="h-178 flex items-center justify-center bg-yellow-300 px-4 m-2 overflow-y-hidden rounded-2xl">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <ShieldX size={70} className="mx-auto text-red-500 mb-4" />

        <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>

        <p className="text-gray-600 mt-3">
          You don't have permission to access this page.
        </p>

        <Link
          to="/dashboard"
          className="inline-block mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
