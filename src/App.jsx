import ThemeRegistry from "@/theme/ThemeRegistry";
import { TabProvider } from "@/context/TabContext";
import AppShell from "@/components/layout/AppShell";
// import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ThemeRegistry>
      <TabProvider>
        <AppShell />
      </TabProvider>
    </ThemeRegistry>
    // <ThemeRegistry>
    //   <TabProvider>
    //     <AppRoutes />
    //   </TabProvider>
    // </ThemeRegistry>
  );
}

export default App;
