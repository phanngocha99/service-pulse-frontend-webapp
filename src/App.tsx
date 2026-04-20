import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { IncidentCreation } from "./pages/IncidentCreation";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { IncidentListOfServiceDesk } from "./pages/IncidentListOfServiceDesk";
import { IncidentDetailOfServiceDesk } from "./pages/IncidentDetailOfServiceDesk";
import { IncidentListOfSelfService } from "./pages/IncidentListOfSelfService";
import { IncidentDetailOfSelfService } from "./pages/IncidentDetailOfSelfService";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<IncidentCreation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/self-service/incidents"
              element={<IncidentListOfSelfService />}
            />
            <Route
              path="/self-service/incidents/:id"
              element={<IncidentDetailOfSelfService />}
            />
            <Route
              path="/service-desk/incidents"
              element={<IncidentListOfServiceDesk />}
            />
            <Route
              path="/service-desk/incidents/:id"
              element={<IncidentDetailOfServiceDesk />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
