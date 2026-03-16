import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";

const AccountSetting = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Profile State
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+92 300 1234567",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState(profileData);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Company State
  const [companyData, setCompanyData] = useState({
    companyName: "ABC Trading Company",
    registrationNumber: "REG-001234",
    industry: "Trading",
    address: "123 Main Street, Karachi",
    city: "Karachi",
    country: "Pakistan",
  });
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyFormData, setCompanyFormData] = useState(companyData);
  const [companySuccess, setCompanySuccess] = useState(false);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    monthlyReports: true,
    expenseReminders: true,
    currency: "PKR",
    dateFormat: "DD/MM/YYYY",
    language: "English",
  });

  // Profile Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData({ ...profileFormData, [name]: value });
  };

  const handleSaveProfile = () => {
    setProfileData(profileFormData);
    setIsEditingProfile(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleCancelProfile = () => {
    setProfileFormData(profileData);
    setIsEditingProfile(false);
  };

  // Company Handlers
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyFormData({ ...companyFormData, [name]: value });
  };

  const handleSaveCompany = () => {
    setCompanyData(companyFormData);
    setIsEditingCompany(false);
    setCompanySuccess(true);
    setTimeout(() => setCompanySuccess(false), 3000);
  };

  const handleCancelCompany = () => {
    setCompanyFormData(companyData);
    setIsEditingCompany(false);
  };

  // Password Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError("");
  };

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    // Here you would make an API call to update the password
    setPasswordSuccess(true);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordForm(false);
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handlePreferenceChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPreferences({
      ...preferences,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: "#EEEDF2",
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Header */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1B0D3F",
            mb: 4,
          }}
        >
          Account Settings
        </Typography>

        {/* Profile Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1B0D3F" }}
              >
                Personal Information
              </Typography>
              {!isEditingProfile && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingProfile(true)}
                  sx={{
                    color: "#1B0D3F",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>

            {profileSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Profile information updated successfully!
              </Alert>
            )}

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={profileFormData.fullName}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  variant={isEditingProfile ? "outlined" : "standard"}
                  sx={{
                    "& .MuiInput-underline:before": {
                      borderColor: "#E0E0E0",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileFormData.email}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  variant={isEditingProfile ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={profileFormData.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditingProfile}
                  variant={isEditingProfile ? "outlined" : "standard"}
                />
              </Grid>
            </Grid>

            {isEditingProfile && (
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  sx={{
                    backgroundColor: "#1B0D3F",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#388E3C" },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelProfile}
                  sx={{
                    color: "#1B0D3F",
                    borderColor: "#1B0D3F",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Company Information Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1B0D3F" }}
              >
                Company Information
              </Typography>
              {!isEditingCompany && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditingCompany(true)}
                  sx={{
                    color: "#1B0D3F",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Edit
                </Button>
              )}
            </Box>

            {companySuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Company information updated successfully!
              </Alert>
            )}

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={companyFormData.companyName}
                  onChange={handleCompanyChange}
                  disabled={!isEditingCompany}
                  variant={isEditingCompany ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Registration Number"
                  name="registrationNumber"
                  value={companyFormData.registrationNumber}
                  onChange={handleCompanyChange}
                  disabled={!isEditingCompany}
                  variant={isEditingCompany ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  name="industry"
                  value={companyFormData.industry}
                  onChange={handleCompanyChange}
                  disabled={!isEditingCompany}
                  variant={isEditingCompany ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={companyFormData.city}
                  onChange={handleCompanyChange}
                  disabled={!isEditingCompany}
                  variant={isEditingCompany ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={companyFormData.country}
                  onChange={handleCompanyChange}
                  disabled={!isEditingCompany}
                  variant={isEditingCompany ? "outlined" : "standard"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={companyFormData.address}
                  onChange={handleCompanyChange}
                  disabled={!isEditingCompany}
                  variant={isEditingCompany ? "outlined" : "standard"}
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            {isEditingCompany && (
              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveCompany}
                  sx={{
                    backgroundColor: "#1B0D3F",
                    color: "white",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#388E3C" },
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelCompany}
                  sx={{
                    color: "#1B0D3F",
                    borderColor: "#1B0D3F",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "#1B0D3F" }}
              >
                Security
              </Typography>
            </Box>

            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Password changed successfully!
              </Alert>
            )}

            <Divider sx={{ mb: 2 }} />

            {!showPasswordForm ? (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1B0D3F",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#2D1B69" },
                }}
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            ) : (
              <Box>
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSavePassword}
                    sx={{
                      backgroundColor: "#1B0D3F",
                      color: "white",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#388E3C" },
                    }}
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setShowPasswordForm(false)}
                    sx={{
                      color: "#1B0D3F",
                      borderColor: "#1B0D3F",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1B0D3F", mb: 2 }}
            >
              Preferences
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={3}>
              {/* Notifications */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1B0D3F", mb: 2 }}
                >
                  Notifications
                </Typography>
                <Box
                  sx={{
                    pl: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        name="monthlyReports"
                        checked={preferences.monthlyReports}
                        onChange={handlePreferenceChange}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#4CAF50",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#4CAF50",
                            },
                        }}
                      />
                    }
                    label="Monthly Reports"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        name="expenseReminders"
                        checked={preferences.expenseReminders}
                        onChange={handlePreferenceChange}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#4CAF50",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: "#4CAF50",
                            },
                        }}
                      />
                    }
                    label="Expense Reminders"
                  />
                </Box>
              </Grid>

              {/* System Settings */}
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1B0D3F", mb: 2 }}
                >
                  System Settings
                </Typography>
                <Box
                  sx={{
                    pl: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      name="currency"
                      value={preferences.currency}
                      onChange={handlePreferenceChange}
                      label="Currency"
                    >
                      <MenuItem value="PKR">Pakistani Rupee (PKR)</MenuItem>
                      <MenuItem value="USD">US Dollar (USD)</MenuItem>
                      <MenuItem value="EUR">Euro (EUR)</MenuItem>
                      <MenuItem value="GBP">British Pound (GBP)</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      name="dateFormat"
                      value={preferences.dateFormat}
                      onChange={handlePreferenceChange}
                      label="Date Format"
                    >
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ maxWidth: 300 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      name="language"
                      value={preferences.language}
                      onChange={handlePreferenceChange}
                      label="Language"
                    >
                      <MenuItem value="English">English</MenuItem>
                      <MenuItem value="Urdu">Urdu</MenuItem>
                      <MenuItem value="Arabic">Arabic</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1B0D3F",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#388E3C" },
                }}
              >
                Save Preferences
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AccountSetting;
