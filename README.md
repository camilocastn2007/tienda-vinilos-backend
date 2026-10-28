# VinilosMilo — Backend API REST 🎵

API REST profesional desarrollada para la tienda virtual **VinilosMilo**, especializada en discos de vinilo y CDs en formatos físicos. Proyecto correspondiente a la **Entrega 3** del curso de Desarrollo Web.

---

## 🔗 Enlaces del Proyecto

- **Repositorio Backend:** [https://github.com/camilocastn2007/tienda-vinilos-backend](https://github.com/camilocastn2007/tienda-vinilos-backend)
- **Repositorio Frontend:** *Enlace al repositorio de Next.js*
- **API Desplegada:** *URL del backend en Render / Railway*
- **Frontend en Vercel:** *URL del sitio en Vercel*

---

## 🏛️ Arquitectura en 4 Capas (Clean Architecture)

El backend está organizado estrictamente en las cuatro capas exigidas, garantizando desacoplamiento e independencia tecnológica:

1. **Domain (`src/domain/`):**
   - Entidades del negocio: `User`, `Disco`, `Pedido`.
   - Contratos de repositorios: `IUserRepository`, `IDiscoRepository`, `IPedidoRepository`.
   - Cero dependencias externas.

2. **Application (`src/application/`):**
   - Casos de uso de autenticación: `RegisterUserUseCase`, `LoginUserUseCase`.
   - Casos de uso del catálogo: `GetDiscosUseCase` (con paginación `{ pagination, data }` y filtros combinados), `GetDiscoByIdUseCase`, `CreateDiscoUseCase`, `UpdateDiscoUseCase`, `DeleteDiscoUseCase`.
   - Casos de uso de interacción: `CreatePedidoUseCase` (con id de usuario tomado del token), `GetMisPedidosUseCase`, `GetAllPedidosUseCase`.
   - Jerarquía de errores de negocio: `AppError`, `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`.

3. **Infrastructure (`src/infrastructure/`):**
   - Cliente singleton de base de datos con **Prisma ORM** (`database/prisma.ts`).
   - Implementaciones concretas de repositorios con Prisma (`PrismaUserRepository`, `PrismaDiscoRepository`, `PrismaPedidoRepository`).
   - Servicios de seguridad y cifrado: `BcryptHasher` (10 rounds de salt) y `JwtService` (firma con expiración y payload mínimo).

4. **Interface / Web (`src/interface/`):**
   - Controladores: `AuthController`, `DiscoController`, `PedidoController`.
   - Enrutadores: `authRoutes`, `discoRoutes`, `pedidoRoutes`.
   - Middlewares centralizados aplicados en los routers: `authMiddleware` (Bearer token), `soloAdmin` / `roleMiddleware`, `errorHandler` global (captura errores de Prisma y oculta stack traces en producción).
   - Servidor Express con política de CORS restrictiva hacia el frontend.

---

## 🔑 Credenciales de Prueba (Seed)

Para evaluar los diferentes roles y accesos protegidos, el seed crea las siguientes cuentas de prueba:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@vinilosmilo.com` | `Admin123*` | Acceso a gestión total del catálogo (`POST`, `PUT`, `DELETE /api/discos`) y ver todos los pedidos del sistema. |
| **Usuario Normal** | `user@vinilosmilo.com` | `User123*` | Realizar pedidos a su nombre y consultar únicamente sus propios pedidos (`/api/pedidos/mias`). |

---

## ⚙️ Variables de Entorno

El archivo `.env` está protegido por `.gitignore` y **nunca** se sube al repositorio. Para ejecutar el proyecto en local, crea un archivo `.env` basado en `.env.example`:

```env
# Puerto del servidor
PORT=4000

# Cadena de conexión a PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/vinilosmilo?schema=public"

# Clave secreta y expiración para los tokens JWT
JWT_SECRET="vinilosmilo_jwt_secret_dev_key_2026_super_secure"
JWT_EXPIRES_IN="24h"

# URL permitida para solicitudes CORS (Frontend en Vercel o local)
FRONTEND_URL="http://localhost:3000"
```

---

## 🚀 Cómo Correr el Proyecto en Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/camilocastn2007/tienda-vinilos-backend.git
   cd tienda-vinilos-backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar el archivo `.env`:**
   ```bash
   cp .env.example .env
   # Ajusta tu DATABASE_URL con tus credenciales de PostgreSQL
   ```

4. **Generar el cliente de Prisma y ejecutar el seed:**
   ```bash
   npm run prisma:generate
   npx prisma db push
   npm run prisma:seed
   ```
   *El seed poblará la base de datos con los 26 discos reales de la Entrega 1 y los dos usuarios de prueba.*

5. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   *El servidor quedará disponible en `http://localhost:4000`.*

6. **Ejecutar pruebas automatizadas:**
   ```bash
   npm test
   ```

---

## 🧠 Decisiones Técnicas en Mis Palabras

### 1. Flujo completo de un login: desde que envías el formulario hasta que una ruta protegida responde
1. **Envío de credenciales:** El usuario llena el formulario en el frontend y envía un `POST /api/auth/login` con su `email` y `password`.
2. **Recepción y aplicación:** La petición entra al router, pasa al `AuthController` y este delega la lógica al `LoginUserUseCase`.
3. **Validación y comparación segura:** El caso de uso consulta al repositorio `PrismaUserRepository` para buscar el usuario por email. Con `BcryptHasher.compare()`, se compara la contraseña en texto plano recibida con el hash almacenado en la base de datos.
4. **Emisión del token:** Si las credenciales coinciden, `JwtService.sign()` genera un JWT firmado con `JWT_SECRET` y tiempo de expiración (`expiresIn: 24h`). Su payload contiene únicamente `{ id, role }` (sin contraseñas ni datos sensibles).
5. **Almacenamiento en cliente:** El frontend recibe el token y lo almacena (en `localStorage` o cookie) para que el cliente HTTP centralizado (`http.ts`) lo adjunte en cada solicitud posterior en la cabecera `Authorization: Bearer <token>`.
6. **Consumo de ruta protegida:** Al solicitar una ruta como `POST /api/pedidos`, el middleware `authMiddleware` intercepta la petición, lee la cabecera `Authorization`, verifica la validez y expiración del token con el secreto del servidor, y extrae los datos del usuario inyectándolos en `req.user`.
7. **Resolución:** El controlador toma el `userId` directamente desde `req.user.id` (garantizando que nadie suplante la identidad de otro) y el caso de uso guarda el pedido en la base de datos devolviendo una respuesta HTTP 201.

### 2. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?
En el frontend se almacena en el `localStorage` del navegador para que la sesión persista al recargar la página (F5). 
* **Riesgo:** El principal riesgo de guardar un JWT en `localStorage` es la vulnerabilidad a ataques **XSS (Cross-Site Scripting)**. Si un atacante logra inyectar un script malicioso en la aplicación, dicho script puede leer `localStorage.getItem('token')` y robar la sesión del usuario.
* **Mitigación / Alternativa ideal:** La alternativa más segura es usar cookies con la directiva `httpOnly`, `Secure` y `SameSite=Strict`, ya que el navegador no permite que JavaScript acceda a la cookie, mitigando el robo por XSS pero requiriendo precauciones contra ataques CSRF (Cross-Site Request Forgery).

### 3. ¿En qué caso tu API responde 401 y en cuál 403? Da un ejemplo real de tu proyecto
* **Código 401 Unauthorized (Falta o falla de autenticación / ¿Quién eres?):**
  - Ocurre cuando el cliente no envía el token o el token proporcionado no es válido, está corrupto o ya expiró.
  - *Ejemplo real en VinilosMilo:* Si un usuario no autenticado o una persona externa intenta hacer una petición `DELETE /api/discos/id-del-disco` sin enviar la cabecera `Authorization: Bearer <token>`, el `authMiddleware` responde inmediatamente con `401 Unauthorized: "Token de autenticación requerido..."`. También responde 401 con un mensaje genérico cuando alguien intenta iniciar sesión con una contraseña incorrecta.
* **Código 403 Forbidden (Falta de autorización / Sé quién eres, pero no tienes permiso):**
  - Ocurre cuando el usuario sí está autenticado correctamente (su token es válido y no ha expirado), pero su rol no tiene los permisos suficientes para ejecutar la acción solicitada.
  - *Ejemplo real en VinilosMilo:* Cuando el usuario normal (`user@vinilosmilo.com`, con rol `user`) inicia sesión e intenta enviar un `DELETE /api/discos/id-del-disco` para borrar un disco del catálogo. El `authMiddleware` valida su token con éxito, pero al pasar al middleware `soloAdmin`, este comprueba que `req.user.role !== 'admin'` y responde de inmediato con `403 Forbidden: "Acceso denegado: se requieren permisos de rol 'admin'..."`.

### 4. Si usaste IA, ¿para qué la usaste y qué tuviste que corregir?
Usé la IA como apoyo para acelerar la definición de las interfaces de Clean Architecture y la migración fiel del arreglo de los 26 discos de JavaScript plano a la sintaxis del `seed.ts` de Prisma. 

* **Lo que tuve que corregir:**
  1. En las rutas de Express 5, la IA había tipado `req.params.id` asumiendo que siempre era `string`, pero TypeScript arrojó errores porque en las nuevas versiones de los tipos de Express puede ser `string | string[]`. Se corrigió realizando una conversión explícita `String(req.params.id)`.
  2. Inicialmente se intentaba obtener el `userId` en el controlador de pedidos a partir de `req.body`, lo cual violaba la regla estricta de seguridad del docente. Lo corregí asegurando que `userId` se extraiga pura y exclusivamente desde el token validado en `req.user.id`.
  3. En la configuración de CORS, la IA colocaba `origin: '*'`; se ajustó para que valide explícitamente la URL del frontend (`FRONTEND_URL`) permitiendo únicamente los dominios autorizados de desarrollo y producción en Vercel.

---

## 📸 Evidencia de Petición Protegida (Header Authorization)

*(Aquí se adjunta la captura de la pestaña Network de las DevTools del navegador mostrando la petición con `Authorization: Bearer <token>` activa).*

```text
Request URL: http://localhost:4000/api/pedidos/mias
Request Method: GET
Status Code: 200 OK
Request Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
