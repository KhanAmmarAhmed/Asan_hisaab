import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Link as RouterLink } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import { isApiError } from "../../services/apiClient";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = form.email.trim();
    if (!email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ ...form, email });
      console.log("🔍 Login Response:", res);
      console.log(
        "📦 Token:",
        res?.token || res?.accessToken || res?.access_token,
      );
      console.log("🔑 Client ID:", res?.client_id);
      console.log("🔐 Secret Key:", res?.secret_key);
      const statusValue =
        res?.status ?? res?.success ?? res?.data?.status ?? res?.data?.success;
      const isSuccess =
        statusValue === true ||
        String(statusValue || "")
          .toLowerCase()
          .trim() === "success";
      if (isSuccess) {
        login({ ...res, email });
        navigate("/dashboard");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError(isApiError(err) ? err.message : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EEEDF2",
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 420,
          width: "100%",
          p: 4,
          boxShadow: "0 4px 20px rgba(27, 13, 63, 0.1)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h5"
            sx={{ color: "#1B0D3F", fontWeight: 700, mb: 1 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to continue to Asan Hisaab
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: 1,
              mb: 3,
              backgroundColor: "#1B0D3F",
              "&:hover": { backgroundColor: "#2D1B69" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Don't have an account?{" "}
            <RouterLink
              to="/signup"
              style={{
                textDecoration: "underline",
                color: "#1B0D3F",
                fontWeight: 600,
              }}
            >
              Sign Up
            </RouterLink>
          </Typography>
        </form>
      </Card>
    </Box>
  );
};

export default LoginPage;
