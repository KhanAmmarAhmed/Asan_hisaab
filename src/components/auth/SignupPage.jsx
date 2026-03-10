import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
// import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { sendOtp, signupUser } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    number: "",
    address: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOtp = async () => {
    if (!form.email) {
      setError("Please enter your email");
      return;
    }
    try {
      const res = await sendOtp(form.email);
      if (res.status === "success") {
        setOtpSent(true);
        setError("");
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Failed to send OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "email",
      "password",
      "otp",
      "number",
      "address",
    ];
    const missing = requiredFields.filter((field) => !form[field]);

    if (missing.length > 0) {
      setError("Please fill in required fields");
      return;
    }

    // if (!otpSent) {
    //   setError("Please send OTP to your email first");
    //   return;
    // }

    if (!form.otp) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await signupUser(form);

      if (res.status === "success") {
        login(res);
        navigate("/dashboard");
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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
        padding: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 4,
          boxShadow: "0 4px 20px rgba(27, 13, 63, 0.1)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: "#1B0D3F", fontWeight: 700, mb: 1 }}
          >
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign up to get started with Asan Hisaab
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Full Name"
                value={form.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                value={form.email}
                onChange={handleChange}
                disabled={otpSent}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSendOtp}
                disabled={!form.email}
                sx={{
                  height: "56px",
                  borderColor: "#1B0D3F",
                  color: "#1B0D3F",
                  "&:hover": {
                    borderColor: "#2D1B69",
                    backgroundColor: "rgba(27, 13, 63, 0.04)",
                  },
                }}
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="otp"
                label="Enter OTP"
                value={form.otp}
                onChange={handleChange}
                // disabled={!otpSent}
                helperText={
                  otpSent ? "OTP is valid for 5 minutes" : ""
                  // : "Send OTP to enable this field"
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MarkEmailReadIcon sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                value={form.password}
                onChange={handleChange}
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
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="number"
                label="Phone Number"
                value={form.number}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                value={form.address}
                onChange={handleChange}
                multiline
                rows={2}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <HomeIcon sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              error is here: {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: "#1B0D3F",
              "&:hover": { backgroundColor: "#2D1B69" },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <RouterLink
              to="/login"
              style={{
                textDecoration: "underline",
                color: "#1B0D3F",
                fontWeight: 600,
              }}
            >
              Sign In
            </RouterLink>
          </Typography>
        </form>
      </Card>
    </Box>
  );
};

export default SignupPage;
