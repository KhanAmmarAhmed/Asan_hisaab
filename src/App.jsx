import ThemeRegistry from "@/theme/ThemeRegistry";
import { TabProvider } from "@/context/TabContext";
import { CompanyProvider } from "./context/CompanyContext";
import { DataProvider } from "./context/DataContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ThemeRegistry>
      <TabProvider>
        <CompanyProvider>
          <DataProvider>
            <AppRoutes />
          </DataProvider>
        </CompanyProvider>
      </TabProvider>
    </ThemeRegistry>
  );
}

export default App;
