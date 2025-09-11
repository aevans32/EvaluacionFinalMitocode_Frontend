# 📚 Biblioteca – Frontend (Angular 20)

Aplicación **Angular 20** que consume los servicios REST del backend de la Biblioteca. Permite la gestión de clientes, libros y pedidos de alquiler, con vistas diferenciadas para usuarios **Clientes** y **Administradores**.
Parte de proyecto final del curso FullStack Development en .Net 9 y Angular 20 de Mitocode.

---

## 👤 Autor
- Andrés Evans
- github.com/aevans32
- linkedin.com/in/andresevans

---

## 🧱 Stack Tecnológico

- **Angular 20**
- **TypeScript**
- **Angular Material** (UI)
- **RxJS / Signals**
- **HTTPClient** para consumo de API REST
- **JWT Authentication**

---

## 🚀 Inicio Rápido

### 1) Prerrequisitos
- Node.js 22+
- Angular CLI 20
- Backend en ejecución (API .NET 9 con Swagger)

### 2) Instalar dependencias
```bash
npm install
```

### 3) Configuración
Editar `src/environments/environment.ts` para apuntar al backend:
```ts
export const environment = {
    baseUrl: 'https://localhost:7294/api/',
};
```

### 4) Ejecutar la app
```bash
npm start
```
Editar `angular.json` para modificar la url de lanzamiento en development:


---

## 🗂️ Estructura de Proyecto (simplificada)

```
public/
	images/
	styles/
	svg/
src/
	app/
		content-config/		# CMS y CRUD de libros por Admin
		home/               # Landing inicial y libros en biblioteca
		libro-detalle/		# Detalle de libro y pagina de renta por Cliente
		login/				# Login de usuarios tipo Cliente y Administrator
		shared/				# Componentes como header y footer, Guards, Models, y Services
		user-profile/		# Perfil de Cliente, libros rentados por DNI en llamada automatica onInit()
		user-signup/		# Creacion de usuario tipo Cliente, creacion de usuario Admin solo por backend endpoints
	shared/             # Header, footer, componentes reutilizables
	environments/			# Environment setup
```

---

## ⚙️ Funcionalidades Implementadas

### ✅ Clientes
- Listado de libros rentados (solo Cliente)
- Creación de usuario Cliente
- 🚧 **Pendiente:** Edición de cliente
- 🚧 **Pendiente:** Solicitud de cambio de contraseña  

### ✅ Libros
- **CRUD completo** (crear, editar, eliminar, listar)  
- Disponible en el **CMS** (solo administradores)

### ✅ Pedidos
- Registro de pedido automático al **rentar** / **checkout** de un libro
- Cierre de pedido al **retornar** / **check-in** del libro
- Vista de libros alquilados por cliente (por DNI de cliente en llamada automatica al cargar componente)
- Historial de pedidos

---

## 🔐 Roles de usuario

- **Administrador**
  - Acceso al CMS
  - CRUD de libros y clientes
- **Cliente**
  - Renta y devolución de libros
  - Consulta de pedidos y perfil

---

## 📖 Notas de Uso

- El **login** emite un **token JWT** que se usa en todas las llamadas autenticadas.
- El **CMS** está protegido por guardas (`AuthGuard` + `RoleGuard`), solo visible para token especifico a Rol Administrator.
- El **Profile** está disponible solo para usuarios con Rol Cliente.
- El **checkout de un libro** dispara la creación de un pedido en el backend.
- El **check-in** actualiza el pedido como completado y libera el libro.

---

## 🧰 Scripts útiles

```bash
# Ejecutar en desarrollo
ng serve
npm start

# Build de producción
ng build --configuration production

# Ejecutar pruebas unitarias
ng test

# Ejecutar pruebas end-to-end
ng e2e
```

---
