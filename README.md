# Backend - Tienda de Vinilos y CDs (VinilosMilo)

API REST desarrollada para la tienda virtual VinilosMilo. El backend está hecho con Node.js, Express, TypeScript, Prisma ORM y PostgreSQL, siguiendo una arquitectura limpia en 4 capas (Clean Architecture).

## Repositorios y Enlaces

- Repositorio Backend: https://github.com/camilocastn2007/tienda-vinilos-backend
- Repositorio Frontend: https://github.com/camilocastn2007/tienda-vinilos-frontend

## Arquitectura del Proyecto

El código está organizado en cuatro capas para separar la lógica de negocio de la tecnología:

1. **Domain (`src/domain/`):** Contiene los modelos base del negocio (`User`, `Disco`, `Pedido`) y las interfaces de los repositorios (`IUserRepository`, `IDiscoRepository`, `IPedidoRepository`). No depende de ninguna librería externa.
2. **Application (`src/application/`):** Casos de uso de la aplicación: registro y login de usuarios, gestión del catálogo de discos con paginación y filtros, y creación y consulta de pedidos. Aquí también se manejan los errores personalizados del negocio.
3. **Infrastructure (`src/infrastructure/`):** Implementación técnica: cliente de base de datos con Prisma ORM, repositorios concretos con consultas a PostgreSQL, servicio de hash con bcrypt y generación/verificación de tokens JWT.
4. **Interface (`src/interface/`):** Controladores y rutas HTTP de Express, middlewares de autenticación (JWT Bearer) y validación de rol de administrador.

## Requisitos

- Node.js 18 o superior
- Docker Desktop o PostgreSQL instalado en local
- Git

## Instrucciones para correr el backend

1. **Base de datos (PostgreSQL con Docker):**
   ```bash
   docker run --name vinilosmilo-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=vinilosmilo -p 5432:5432 -d postgres:16
   ```

2. **Instalar paquetes:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crear un archivo `.env` en la raíz de `backend/` con los siguientes valores:
   ```env
   PORT=4000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vinilosmilo?schema=public"
   JWT_SECRET="vinilosmilo_jwt_secret_dev_key_2026_super_secure"
   JWT_EXPIRES_IN="24h"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Sincronizar base de datos y correr seed:**
   ```bash
   npx prisma db push
   npm run prisma:seed
   ```
   *Esto crea las tablas e inserta los 26 discos del catálogo junto con dos usuarios de prueba.*

5. **Iniciar el servidor en desarrollo:**
   ```bash
   npm run dev
   ```
   *La API queda escuchando en `http://localhost:4000/api`.*

6. **Correr pruebas:**
   ```bash
   npm test
   ```

## Usuarios de prueba (Seed)

- **Administrador:** `admin@vinilosmilo.com` / `Admin123*` (puede crear, editar y borrar discos, y ver todos los pedidos del sistema).
- **Usuario normal:** `user@vinilosmilo.com` / `User123*` (puede hacer pedidos y ver/cancelar únicamente sus propios pedidos).

---

## Preguntas Teóricas y Decisiones del Proyecto

### 1. Flujo completo de un login: desde que se envía el formulario hasta que responde una ruta protegida

Cuando el usuario ingresa su correo y contraseña en el formulario y da clic en iniciar sesión, ocurre lo siguiente:

1. El frontend envía una petición `POST /api/auth/login` con el correo y la contraseña en formato JSON.
2. La petición llega al router de Express, pasa al `AuthController` y este llama al caso de uso `LoginUserUseCase`.
3. El caso de uso consulta a la base de datos a través de Prisma para buscar al usuario por su email. Si no existe, lanza un error de credenciales inválidas.
4. Si el usuario existe, se utiliza `bcrypt.compare` para comparar la contraseña que escribió el usuario con el hash guardado en PostgreSQL.
5. Si coinciden, se genera un token JWT firmado con la clave secreta del servidor (`JWT_SECRET`) que contiene en su carga útil el `id` y el `role` del usuario, con vencimiento de 24 horas.
6. El backend devuelve el token y los datos básicos del usuario al frontend, y este último guarda el token en `localStorage`.
7. Cuando el usuario hace una acción protegida (por ejemplo, ver sus pedidos en `GET /api/pedidos/mias`), el cliente HTTP añade automáticamente el encabezado `Authorization: Bearer <token>`.
8. En el backend, el `authMiddleware` intercepta la petición, verifica que el token sea auténtico y no haya vencido, extrae el `id` del usuario del token y lo inyecta en `req.user`. Con ese ID el controlador busca únicamente los pedidos de esa persona y devuelve la respuesta.

### 2. ¿Dónde se guarda el token en el frontend y qué riesgo tiene esa decisión?

En el frontend guardé el token en el `localStorage` del navegador para que la sesión no se pierda al recargar la página o navegar entre pestañas.

El principal riesgo de usar `localStorage` es que es accesible por cualquier código JavaScript que corra en la página. Si la aplicación llega a tener una vulnerabilidad de tipo XSS (Cross-Site Scripting), un atacante podría inyectar un script y leer el token directamente con `localStorage.getItem()`.

Una alternativa más segura para producción sería guardar el token en una cookie con las propiedades `HttpOnly`, `Secure` y `SameSite`. Al ser `HttpOnly`, el navegador no permite que JavaScript lea la cookie, lo que protege contra XSS, aunque en ese caso toca proteger la aplicación contra ataques CSRF.

### 3. ¿En qué caso la API responde 401 y en cuál 403? Ejemplos del proyecto

La diferencia básica es que el **401** significa "no sé quién eres o tus credenciales no sirven", mientras que el **403** significa "sé quién eres, pero no tienes permiso para hacer esto".

- **Ejemplo de 401 (Unauthorized):** Si alguien intenta entrar a `GET /api/pedidos/mias` o hacer un pedido en `POST /api/pedidos` sin haber iniciado sesión (sin enviar el encabezado `Authorization`), o si envía un token inventado o que ya expiró. El middleware rechaza la petición con 401 porque falta una autenticación válida.
- **Ejemplo de 403 (Forbidden):** Si el usuario normal (`user@vinilosmilo.com`) inicia sesión, tiene su token válido y trata de hacer un `DELETE /api/discos/:id` para borrar un disco del catálogo. El middleware de autenticación valida su token (sabe quién es), pero luego el middleware de roles (`soloAdmin`) revisa su rol, se da cuenta de que es `user` y no `admin`, y le devuelve un 403 prohibiendo la acción.

### 4. Uso de IA en el desarrollo y correcciones realizadas

Utilicé herramientas de IA como apoyo principalmente para dos cosas: definir la estructura inicial de las interfaces en TypeScript para la arquitectura en capas y migrar la lista de los 26 discos que teníamos en JavaScript a la estructura que pedía el archivo `seed.ts` de Prisma.

Durante el proceso tuve que corregir varios puntos donde la IA generó código incorrecto o con malas prácticas:
- **Obtención del usuario en pedidos:** Inicialmente la IA intentó recibir el `userId` en el cuerpo de la petición (`req.body`). Esto era un fallo grave de seguridad porque cualquier persona podría enviar el ID de otro usuario y hacer pedidos a su nombre. Lo corregí para que el `userId` se tome obligatoriamente del token validado en `req.user.id`.
- **Tipado con Express:** En los parámetros de ruta (`req.params.id`), la IA asumía que siempre eran de tipo `string`, pero TypeScript marcaba advertencias por compatibilidad de tipos, por lo que aseguré las conversiones explícitas.
- **Configuración de CORS:** En un inicio la sugerencia venía con `origin: '*'`, lo cual dejaba la API abierta a cualquier origen. Lo ajusté para que valide contra la variable de entorno `FRONTEND_URL`, permitiendo únicamente conexiones desde el frontend de la tienda.

### 5. Evidencias de la pagina web
<img width="1919" height="960" alt="image" src="https://github.com/user-attachments/assets/498acf01-a2d1-49f1-a8af-f89557aeea4f" />
<img width="1919" height="990" alt="image" src="https://github.com/user-attachments/assets/69814d46-86ac-40c0-ab56-e9305dc91715" /><img width="1919" height="959" alt="image" src="https://github.com/user-attachments/assets/3a61ea83-5f15-4455-b400-a57f90591b38" />
<img width="1919" height="981" alt="image" src="https://github.com/user-attachments/assets/0be611b2-c7ad-40fe-acfb-40f92ee90c64" />
- en este item de aca se hace un registro en el que no estaban todos los caracteres necesarios, luego se agregan los faltantes y se procede con una respuesta correcta
- <img width="1919" height="977" alt="image" src="https://github.com/user-attachments/assets/3fd29182-df2d-43ae-98dd-98ee33077f2a" />



