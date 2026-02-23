import ThemeRegistry from "@/theme/ThemeRegistry";
import { TabProvider } from "@/context/TabContext";
import { CompanyProvider } from "./context/CompanyContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ThemeRegistry>
      <TabProvider>
        <CompanyProvider>
          <AppRoutes />
        </CompanyProvider>
      </TabProvider>
    </ThemeRegistry>
  );
}

export default App;
