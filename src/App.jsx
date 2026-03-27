import ThemeRegistry from "@/theme/ThemeRegistry";
import { TabProvider } from "@/context/TabContext";
import { CompanyProvider } from "./context/CompanyContext";
import { DataProvider } from "./context/DataContext";
import AppRoutes from "./routes/AppRoutes";
import SessionExpiredModal from "./components/auth/SessionExpiredModal";

function App() {
  return (
    <ThemeRegistry>
      <TabProvider>
        <CompanyProvider>
          <DataProvider>
            <AppRoutes />
            <SessionExpiredModal />
          </DataProvider>
        </CompanyProvider>
      </TabProvider>
    </ThemeRegistry>
  );
}

export default App;
