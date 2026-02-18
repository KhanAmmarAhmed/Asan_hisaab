import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";
import TabContent from "./TabContent";

export default function AppShell() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#EEEDF2",
      }}
    >
      <Navbar />
      <HeroSection />
      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, md: 4 },
          py: 3,
        }}
      >
        <TabContent />
      </Box>
      <Footer />
    </Box>
  );
}
