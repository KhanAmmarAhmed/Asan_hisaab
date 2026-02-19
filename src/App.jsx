import ThemeRegistry from "@/theme/ThemeRegistry";
import { TabProvider } from "@/context/TabContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ThemeRegistry>
      <TabProvider>
        <AppRoutes />
      </TabProvider>
    </ThemeRegistry>
  );
}

export default App;
