import { Routes, Route, Navigate } from "react-router";
import React, { Suspense } from "react"; // precisa
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { AuthProvider } from "./services/AuthService";
import { RtAlertManager } from "./hooks/rtalert";
import LoadingData from "./hooks/LoadingData";
import FuncionarioManager from "./pages/Dashboard/funcionario/FuncionarioManager";
import Home from "./pages/Dashboard/Home";
import DashboardCursos from "./pages/Dashboard/cursos/DashboardCursos";
import SettingsPage from "./pages/Dashboard/SettingsPage";
import CategoriasPage from "./pages/Dashboard/categorias/CategoriasPage";
import DashBoards from "./pages/Dashboard/DashBoards";

// Lazy imports (code splitting)
const SignIn = React.lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = React.lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = React.lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = React.lazy(() => import("./pages/UserProfiles"));
const Videos = React.lazy(() => import("./pages/UiElements/Videos"));
const Images = React.lazy(() => import("./pages/UiElements/Images"));
const Alerts = React.lazy(() => import("./pages/UiElements/Alerts"));
const Badges = React.lazy(() => import("./pages/UiElements/Badges"));
const Avatars = React.lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = React.lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = React.lazy(() => import("./pages/Charts/LineChart"));
const BarChart = React.lazy(() => import("./pages/Charts/BarChart"));
const Calendar = React.lazy(() => import("./pages/Calendar"));
const BasicTables = React.lazy(() => import("./pages/Tables/BasicTables"));
const WelcomeManager = React.lazy(() => import("./pages/Dashboard/WelcomeManager"));
const FormElements = React.lazy(() => import("./pages/Forms/FormElements"));
const Blank = React.lazy(() => import("./pages/Blank"));
const MunicipioManager = React.lazy(() => import("./pages/Dashboard/Localizacao/MunicipioManager"));
const ProvinciaManager = React.lazy(() => import("./pages/Dashboard/Localizacao/ProvinciaManager"));
const PaisManager = React.lazy(() => import("./pages/Dashboard/Localizacao/PaisManager"));
const ComunaManager = React.lazy(() => import("./pages/Dashboard/Localizacao/ComunaManager"));
const BairroManager = React.lazy(() => import("./pages/Dashboard/Localizacao/BairroManager"));
const RuaManager = React.lazy(() => import("./pages/Dashboard/Localizacao/RuaManager"));
const DepartamentoManager = React.lazy(() => import("./pages/Dashboard/departamentos/DepartamentoManager"));
const MenuManager = React.lazy(() => import("./pages/Dashboard/menus/MenuManager"));
const UsuarioManager = React.lazy(() => import("./pages/Dashboard/usuario/UsuarioManager"));
const LogsManager = React.lazy(() => import("./pages/Dashboard/logs/LogsManager"));
const EntidadeManager = React.lazy(() => import("./pages/Dashboard/entidadedes/EntidadeManager"));
const ViewEntidade = React.lazy(() => import("./pages/Dashboard/entidadedes/ViewEntidade"));

export default function App() {
  return (
    <AuthProvider>
      <RtAlertManager />
      <ScrollToTop />
      {/* Suspense vai mostrar algo enquanto carrega */}
      <Suspense fallback={<LoadingData />}>
        <Routes>
          {/* Dashboard Layout */}
          <Route index path="/welcome" element={<WelcomeManager />} />
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Navigate to="welcome" replace />} />

            {/* Others Page */}
            <Route path="/dashboard">
              <Route index element={<DashBoards />} />
              <Route path="profile/:id" element={<UserProfiles />} />
            </Route>

            <Route path="/vendas">
              <Route index element={<Navigate to="clientes" replace />} />
              {/* <Route path="funcionarios" element={<FuncionarioManager />} /> */}
              <Route path="clientes" element={<EntidadeManager />} />
              <Route path="clientes/view/:id" element={<ViewEntidade />} />
            </Route>

            <Route path="/rh">
              <Route index element={<Navigate to="funcionarios" replace />} />
              <Route path="funcionarios" element={<FuncionarioManager />} />
              <Route path="funcionarios/view/:id" element={<ViewEntidade />} />
            </Route>

            <Route path="configuracoes" element={<SettingsPage />} />
            {/* <Route path="/configuracoes/usuarios" element={<GerirUsuarios />} /> */}
            <Route path="/configuracoes/categorias" element={<CategoriasPage />} />
            <Route path="/configuracoes/cursos" element={<DashboardCursos />} />

            <Route path="/ajuda">
              <Route index path="logs" element={<LogsManager />} />
            </Route>

            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
