import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        backendUrl + "/api/user/admin", // ✅ FIXED
        { email, password }
      );

      if (response.data.success) {
        const token = response.data.token;

        // ✅ store token
        localStorage.setItem("adminToken", token);

        setToken(token);

        toast.success("Login Successful");

        // ✅ redirect to dashboard
        navigate("/add");

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gray-50">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md w-full">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Admin Login
        </h1>

        <form onSubmit={onSubmitHandler}>

          {/* Email */}
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Email</p>
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <p className="text-sm font-medium mb-2">Password</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md outline-none"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-black text-white rounded-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;