import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";

// ⚠️ CHANGED: now accepts `children` prop instead of rendering <TabContent /> directly.
// To restore previous behaviour: remove `{ children }` param and replace `{children}` with `<TabContent />` (re-import TabContent too).
export default function AppShell({ children }) {
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
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
