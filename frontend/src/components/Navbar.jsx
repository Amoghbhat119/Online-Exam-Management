import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-purple-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/login" className="text-2xl font-bold tracking-wide hover:opacity-90">
          🎓 Online Exam
        </Link>

        <div className="flex items-center gap-4">
          {user?.role === "Admin" && (
            <Link className="hover:text-yellow-200 transition" to="/admin">
              Admin
            </Link>
          )}
          {user && (
            <Link className="hover:text-yellow-200 transition" to="/results">
              Results
            </Link>
          )}
          {!user && (
            <>
              <Link className="hover:text-yellow-200 transition" to="/login">Login</Link>
              <Link className="hover:text-yellow-200 transition" to="/signup">Signup</Link>
            </>
          )}
          {user && (
            <>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-white/15 border border-white/20">
                {user.name} • {user.role}
              </span>
              <button
                onClick={logout}
                className="bg-white text-indigo-700 font-semibold px-3 py-1 rounded-lg hover:bg-yellow-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
