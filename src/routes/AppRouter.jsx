import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "../features/auth/pages/Login";
import { AdminLayout } from "../layouts/AdminLayout";
// import { Usuarios } from "../features/usuario/pages/Usuarios";
// import { Categorias } from "../features/categoria/pages/Categorias";
import { Productos } from "../features/producto/pages/Productos";
import { Clientes } from "../features/cliente/pages/Clientes";
import { Estudiantes } from "../features/estudiante/pages/Estudiantes";
// import { Cursos } from "../features/curso/pages/Cursos";
// import { Niveles } from "../features/nivel/pages/Niveles";
// import { Grados } from "../features/grado/pages/Grados";
// import { Especialidades } from "../features/especialidad/pages/Especialidades";
// import { RolesPermisos } from "../features/rol/pages/RolesPermisos";
import { Auditorias } from "../features/auditoria/pages/Auditorias";
import { Ventas } from "../features/venta/pages/Ventas";
import AuthGuard from "../components/AuthGuard";
import { NivelContextProvider } from "../features/nivel/context/NivelContextProvider";
import { EspecialidadContextProvider } from "../features/especialidad/context/EspecialidadContextProvider";
import { GradoContextProvider } from "../features/grado/context/GradoContextProvider";
import { CursoContextProvider } from "../features/curso/context/CursoContextProvider";
import { RolePermisoContextProvider } from "../features/rol/context/RolePermisoContextProvider";
import { UsuarioContextProvider } from "../features/usuario/context/UsuarioContextProvider";

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
            <Route path="categorias" element={<Categorias />} />
            <Route path="productos" element={<Productos />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="estudiantes" element={<Estudiantes />} />
            <Route path="cursos" element={<CursoContextProvider><Cursos /></CursoContextProvider>} />
            <Route path="niveles" element={<NivelContextProvider><Niveles /></NivelContextProvider>} />
            <Route path="grados" element={<GradoContextProvider><Grados /></GradoContextProvider>} />
            <Route path="especialidades" element={<EspecialidadContextProvider><Especialidades /></EspecialidadContextProvider>} />
            <Route path="roles_permisos" element={<RolePermisoContextProvider><RolesPermisos /></RolePermisoContextProvider>} />
            <Route path="usuarios" element={<UsuarioContextProvider><Usuarios /></UsuarioContextProvider>} />
            <Route path="auditorias" element={<Auditorias />} />
          </Route>
        </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
