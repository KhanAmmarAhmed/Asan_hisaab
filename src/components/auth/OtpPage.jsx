import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { verifyOtpAndSignup, sendOtp } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const OtpPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data passed from signup page
  const userData = location.state?.userData || {};

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Automatically send OTP when component mounts
  useEffect(() => {
    if (userData.email && !otpSent) {
      handleSendOtp();
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    // Only allow numeric input
    const numericValue = value.replace(/\D/g, "");
    setOtp(numericValue);
    setError("");

    // Auto-verify when 6 digits are entered
    if (numericValue.length === 6) {
      handleVerifyOtp(numericValue);
    }
  };

  const handleSendOtp = async () => {
    if (!userData.email) {
      setError("Email not found. Please go back and sign up again.");
      return;
    }

    setSending(true);
    setError("");
    try {
      const res = await sendOtp(userData.email);
      if (res.status === "success" || res.message) {
        console.log("sending OTP!!!!");
        setOtpSent(true);
      } else {
        // setError("Failed to send OTP. Please try again.");
        null;
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (otpValue = null) => {
    const otpToVerify = otpValue || otp;

    if (!otpToVerify) {
      setError("Please enter the OTP");
      return;
    }

    if (!otpToVerify.trim()) {
      setError("OTP cannot be empty");
      return;
    }

    if (!userData.email) {
      setError("Email not found. Please go back and sign up again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await verifyOtpAndSignup({
        ...userData,
        otp: otpToVerify.trim(),
      });

      if (res.status === "success") {
        const enrichedAccount = {
          ...res,
          name: res?.name || userData?.name || res?.user?.name,
          email: res?.email || userData?.email || res?.user?.email,
          number:
            res?.number ||
            res?.phone ||
            userData?.number ||
            res?.user?.number ||
            res?.user?.phone,
          address: res?.address || userData?.address || res?.user?.address,
        };
        login(enrichedAccount);
        navigate("/dashboard");
      } else {
        setError(res.message || "Verification failed. Please try again.");
        setOtp(""); // Clear OTP on failure
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Something went wrong. Please try again.");
      setOtp(""); // Clear OTP on error
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userData.email) {
      setError("Email not found. Please go back and sign up again.");
      return;
    }

    setSending(true);
    setError("");
    try {
      const res = await sendOtp(userData.email);
      if (res.status === "success" || res.message) {
        setError("");
        alert("OTP sent successfully!");
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleGoBack = () => {
    navigate("/signup");
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
          maxWidth: 450,
          width: "100%",
          p: 4,
          boxShadow: "0 4px 20px rgba(27, 13, 63, 0.1)",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            mb: 2,
            color: "#666",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.04)",
            },
          }}
        >
          Back to Signup
        </Button>

        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              color: "#1B0D3F",
            }}
          >
            <MarkEmailReadIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ color: "#1B0D3F", fontWeight: 700, mb: 1 }}
          >
            Verify Your Email
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            We've sent a verification code to
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: "#1B0D3F",
              backgroundColor: "rgba(27, 13, 63, 0.08)",
              py: 1,
              px: 2,
              borderRadius: 1,
              display: "inline-block",
            }}
          >
            {userData.email}
          </Typography>
        </Box>

        {/* OTP Field and Verify Button - Always Visible */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="otp"
              label="Enter OTP"
              value={otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              disabled={loading}
              inputProps={{ maxLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MarkEmailReadIcon sx={{ color: "#666" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              {otpSent
                ? "Enter the 6-digit code sent to your email"
                : "Click verify to send OTP to your email"}
            </Typography>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => (otpSent ? handleVerifyOtp() : handleSendOtp())}
              disabled={(otpSent && otp.length !== 6) || loading || sending}
              startIcon={!otpSent ? <SendIcon /> : null}
              sx={{
                backgroundColor: "#1B0D3F",
                "&:hover": { backgroundColor: "#2D1B69" },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {sending
                ? "Sending OTP..."
                : loading
                  ? "Verifying OTP..."
                  : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
            </Button>
          </Grid>

          {otpSent && (
            <Grid item xs={12}>
              <Button
                variant="text"
                fullWidth
                onClick={handleSendOtp}
                disabled={sending || loading}
                sx={{
                  color: "#1B0D3F",
                  textTransform: "none",
                }}
              >
                {sending ? "Sending..." : "Resend OTP"}
              </Button>
            </Grid>
          )}
        </Grid>
      </Card>
    </Box>
  );
};

export default OtpPage;
