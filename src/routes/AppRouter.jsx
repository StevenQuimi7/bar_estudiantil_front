import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../features/auth/pages/Login";
import { AdminLayout } from "../layouts/AdminLayout";
// import { Usuarios } from "../features/usuario/pages/Usuarios";
// import { Categorias } from "../features/categoria/pages/Categorias";
// import { Productos } from "../features/producto/pages/Productos";
// import { Clientes } from "../features/cliente/pages/Clientes";
// import { Estudiantes } from "../features/estudiante/pages/Estudiantes";
// import { Cursos } from "../features/curso/pages/Cursos";
// import { Niveles } from "../features/nivel/pages/Niveles";
// import { Grados } from "../features/grado/pages/Grados";
// import { Especialidades } from "../features/especialidad/pages/Especialidades";
// import { RolesPermisos } from "../features/rol/pages/RolesPermisos";
// import { Auditorias } from "../features/auditoria/pages/Auditorias";
import { Ventas } from "../features/venta/pages/Ventas";
import AuthGuard from "../components/AuthGuard";
import { NivelContextProvider } from "../features/nivel/context/NivelContextProvider";
import { EspecialidadContextProvider } from "../features/especialidad/context/EspecialidadContextProvider";
import { GradoContextProvider } from "../features/grado/context/GradoContextProvider";
import { CursoContextProvider } from "../features/curso/context/CursoContextProvider";
import { RolePermisoContextProvider } from "../features/rol/context/RolePermisoContextProvider";
import { UsuarioContextProvider } from "../features/usuario/context/UsuarioContextProvider";
import { EstudianteContextProvider } from "../features/estudiante/context/EstudianteContextProvider";
import { ClienteContextProvider } from "../features/cliente/context/ClienteContextProvider";
import { CreditoContextProvider } from "../features/cliente/credito/context/CreditoContextProvider";
import { ProductoContextProvider } from "../features/producto/context/ProductoContextProvider";
import { VentaDiariaContextProvider } from "../features/venta/venta-diaria/context/VentaDiariaContextProvider";
import { ControlVentaContextProvider } from "../features/venta/control-venta/context/ControlVentaContextProvider";
import { PerfilContextProvider } from "../features/perfil/context/PerfilContextProvider";
import { AuditoriaContextProvider } from "../features/auditoria/context/AuditoriaContextProvider";
import { DashboardContextProvider } from "../features/dashboard/context/DashboardContextProvider";
// import { VentaDiarias } from "../features/venta/venta-diaria/pages/VentaDiarias";

const Categorias = lazy(() =>
  import('../features/categoria/pages/Categorias').then(module => ({
    default: module.Categorias
  }))
);
const Niveles = lazy(() =>
  import('../features/nivel/pages/Niveles').then(module => ({
    default: module.Niveles
  }))
);

const Especialidades = lazy(() =>
  import('../features/especialidad/pages/Especialidades').then(module => ({
    default: module.Especialidades
  }))
);

const Grados = lazy(() =>
  import('../features/grado/pages/Grados').then(module => ({
    default: module.Grados
  }))
);

const Cursos = lazy(() =>
  import('../features/curso/pages/Cursos').then(module => ({
    default: module.Cursos
  }))
);

const RolesPermisos = lazy(() =>
  import('../features/rol/pages/RolesPermisos').then(module => ({
    default: module.RolesPermisos
  }))
);

const Estudiantes = lazy(() =>
  import('../features/estudiante/pages/Estudiantes').then(module => ({
    default: module.Estudiantes
  }))
);

const Clientes = lazy(() =>
  import('../features/cliente/pages/Clientes').then(module => ({
    default: module.Clientes
  }))
);

const Creditos = lazy(() =>
  import('../features/cliente/credito/pages/Creditos').then(module => ({
    default: module.Creditos
  }))
);

const Productos = lazy(() =>
  import('../features/producto/pages/Productos').then(module => ({
    default: module.Productos
  }))
);

const VentaDiarias = lazy(() =>
  import('../features/venta/venta-diaria/pages/VentaDiarias').then(module => ({
    default: module.VentaDiarias
  }))
);

const ControlVentas = lazy(() =>
  import('../features/venta/control-venta/pages/ControlVentas').then(module => ({
    default: module.ControlVentas
  }))
);

const Perfils = lazy(() =>
  import('../features/perfil/pages/Perfils').then(module => ({
    default: module.Perfils
  }))
);

const Auditorias = lazy(() =>
  import('../features/auditoria/pages/Auditorias').then(module => ({
    default: module.Auditorias
  }))
);

const DashboardVentas = lazy(() =>
  import('../features/dashboard/pages/DashboardVentas').then(module => ({
    default: module.DashboardVentas
  }))
);

const Usuarios = lazy(() =>
  import('../features/usuario/pages/Usuarios').then(module => ({
    default: module.Usuarios
  }))
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas dentro de AuthGuard */}
        <Route
          path="/admin"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index path="ventas" element={<Ventas />} />
          <Route path="ventas/ventas-diarias" element={<VentaDiariaContextProvider><VentaDiarias /></VentaDiariaContextProvider>} />
          <Route path="ventas/control-ventas" element={<ControlVentaContextProvider><ControlVentas /></ControlVentaContextProvider>} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="dashboards" element={<DashboardContextProvider><DashboardVentas /></DashboardContextProvider>} />
          <Route path="productos" element={<ProductoContextProvider><Productos /></ProductoContextProvider>} />
          <Route path="clientes" element={<ClienteContextProvider><Clientes /></ClienteContextProvider>} />
          <Route path="clientes/creditos/:id" element={<CreditoContextProvider><Creditos /></CreditoContextProvider>} />
          <Route path="estudiantes" element={<EstudianteContextProvider><Estudiantes /></EstudianteContextProvider>} />
          <Route path="estudiantes/creditos/:id" element={<CreditoContextProvider><Creditos /></CreditoContextProvider>} />
          <Route path="cursos" element={<CursoContextProvider><Cursos /></CursoContextProvider>} />
          <Route path="niveles" element={<NivelContextProvider><Niveles /></NivelContextProvider>} />
          <Route path="grados" element={<GradoContextProvider><Grados /></GradoContextProvider>} />
          <Route path="especialidades" element={<EspecialidadContextProvider><Especialidades /></EspecialidadContextProvider>} />
          <Route path="roles_permisos" element={<RolePermisoContextProvider><RolesPermisos /></RolePermisoContextProvider>} />
          <Route path="usuarios" element={<UsuarioContextProvider><Usuarios /></UsuarioContextProvider>} />
          <Route path="mi_perfil" element={<PerfilContextProvider><Perfils /></PerfilContextProvider>} />
          <Route path="auditorias" element={<AuditoriaContextProvider><Auditorias /></AuditoriaContextProvider>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
