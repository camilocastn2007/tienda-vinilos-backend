// src/index.ts
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎵 Servidor VinilosMilo corriendo en el puerto ${PORT}`);
  console.log(`📡 URL base: http://localhost:${PORT}/api`);
  console.log(`🔐 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`===============================================`);
});
