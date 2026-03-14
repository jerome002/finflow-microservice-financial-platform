import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">

      <h1 className="text-5xl font-bold text-blue-600 mb-4">
        FinFlow
      </h1>

      <p className="text-gray-600 mb-8 text-center max-w-md">
        FinFlow is a secure digital wallet platform that allows users to
        manage funds, transfer money, and track transactions in real time.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300"
        >
          Register
        </Link>
      </div>

    </div>
  );
}

export default Home;