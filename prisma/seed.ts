// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const catalogoDiscos = [
  // --- URBANO ---
  {
    artista: "Quevedo",
    titulo: "Buenas Noches",
    genero: "reggaeton",
    precio: 145000,
    imagen: "/img/discos/Urbano/BUENASNOCHES.jpg",
    stock: 12
  },
  {
    artista: "Jhay Wheeler",
    titulo: "Girasoles",
    genero: "reggaeton",
    precio: 155000,
    imagen: "/img/discos/Urbano/GIRASOLES.jpg",
    stock: 8
  },
  {
    artista: "Feid",
    titulo: "Intershibuya",
    genero: "reggaeton",
    precio: 160000,
    imagen: "/img/discos/Urbano/INTERSHIBUYA.jpg",
    stock: 15
  },
  {
    artista: "Omar Courtz",
    titulo: "Mi Primera Musa",
    genero: "reggaeton",
    precio: 135000,
    imagen: "/img/discos/Urbano/MIPRIMERAMUSA.jpg",
    stock: 10
  },
  {
    artista: "Mora",
    titulo: "Paraíso",
    genero: "reggaeton",
    precio: 150000,
    imagen: "/img/discos/Urbano/PARAISO Mora.jpg",
    stock: 14
  },
  {
    artista: "Mora",
    titulo: "Primer Día de Clases",
    genero: "reggaeton",
    precio: 140000,
    imagen: "/img/discos/Urbano/PRIMERDIADECLASES.jpg",
    stock: 9
  },
  {
    artista: "Dei V",
    titulo: "Quién es Dei V?",
    genero: "reggaeton",
    precio: 130000,
    imagen: "/img/discos/Urbano/QUIENESDEIV.jpg",
    stock: 7
  },
  {
    artista: "Álvaro Díaz",
    titulo: "Sayonara",
    genero: "reggaeton",
    precio: 145000,
    imagen: "/img/discos/Urbano/SAYONARA.jpg",
    stock: 11
  },
  {
    artista: "Jhayco",
    titulo: "Timelezz",
    genero: "reggaeton",
    precio: 150000,
    imagen: "/img/discos/Urbano/TIMELEZZ.jpg",
    stock: 6
  },
  {
    artista: "Rauw Alejandro",
    titulo: "Vice Versa",
    genero: "reggaeton",
    precio: 155000,
    imagen: "/img/discos/Urbano/VICEVERSA.jpg",
    stock: 13
  },

  // --- SALSA ---
  {
    artista: "Willie Colón",
    titulo: "Cosa Nuestra",
    genero: "salsa",
    precio: 125000,
    imagen: "/img/discos/Salsa/COSANUESTRA.jpg",
    stock: 10
  },
  {
    artista: "Héctor Lavoe",
    titulo: "La Voz",
    genero: "salsa",
    precio: 130000,
    imagen: "/img/discos/Salsa/LAVOZ.jpg",
    stock: 8
  },
  {
    artista: "Rubén Blades",
    titulo: "Siembra",
    genero: "salsa",
    precio: 140000,
    imagen: "/img/discos/Salsa/SIEMBRA.jpg",
    stock: 15
  },

  // --- ROCK EN INGLÉS ---
  {
    artista: "Arctic Monkeys",
    titulo: "AM",
    genero: "rock-ingles",
    precio: 165000,
    imagen: "/img/discos/Rock en ingles/AM.jpg",
    stock: 20
  },
  {
    artista: "Guns N' Roses",
    titulo: "Appetite for Destruction",
    genero: "rock-ingles",
    precio: 170000,
    imagen: "/img/discos/Rock en ingles/APETITEFORDESTRUCTION.jpg",
    stock: 9
  },
  {
    artista: "Chase Atlantic",
    titulo: "Chase Atlantic",
    genero: "rock-ingles",
    precio: 145000,
    imagen: "/img/discos/Rock en ingles/CHASEATLANTIC.jpg",
    stock: 5
  },
  {
    artista: "TV Girl",
    titulo: "French Exit",
    genero: "rock-ingles",
    precio: 155000,
    imagen: "/img/discos/Rock en ingles/FRENCHEXIT.jpg",
    stock: 7
  },
  {
    artista: "The Neighbourhood",
    titulo: "I Love You.",
    genero: "rock-ingles",
    precio: 150000,
    imagen: "/img/discos/Rock en ingles/ILOVEYOU.jpeg",
    stock: 12
  },
  {
    artista: "The Strokes",
    titulo: "Is This It",
    genero: "rock-ingles",
    precio: 160000,
    imagen: "/img/discos/Rock en ingles/ISTHISHIT.jpeg",
    stock: 11
  },
  {
    artista: "Nirvana",
    titulo: "Nevermind",
    genero: "rock-ingles",
    precio: 175000,
    imagen: "/img/discos/Rock en ingles/NEVERMIND.jpeg",
    stock: 18
  },
  {
    artista: "The Last Shadow Puppets",
    titulo: "The Age of the Understatement",
    genero: "rock-ingles",
    precio: 165000,
    imagen: "/img/discos/Rock en ingles/THEAGEOFTHEUNDERSTANMENDT.jpg",
    stock: 6
  },

  // --- ROCK EN ESPAÑOL ---
  {
    artista: "Gustavo Cerati",
    titulo: "Bocanada",
    genero: "rock-pop-espanol",
    precio: 180000,
    imagen: "/img/discos/Rock en español/BOCANADA.jpg",
    stock: 14
  },
  {
    artista: "Soda Stereo",
    titulo: "Canción Animal",
    genero: "rock-pop-espanol",
    precio: 175000,
    imagen: "/img/discos/Rock en español/CANCIONANIMAL.jpg",
    stock: 16
  },
  {
    artista: "Los Prisioneros",
    titulo: "Corazones",
    genero: "rock-pop-espanol",
    precio: 140000,
    imagen: "/img/discos/Rock en español/CORAZONES.jpg",
    stock: 10
  },
  {
    artista: "Zoé",
    titulo: "MTV Unplugged",
    genero: "rock-pop-espanol",
    precio: 150000,
    imagen: "/img/discos/Rock en español/MTVUNPLUGE.jpg",
    stock: 8
  },
  {
    artista: "Luis Miguel",
    titulo: "Romance",
    genero: "rock-pop-espanol",
    precio: 160000,
    imagen: "/img/discos/Rock en español/ROMANCE.jpeg",
    stock: 12
  }
];

async function main() {
  console.log('--- Iniciando seed de VinilosMilo ---');

  // 1. Crear usuarios de prueba con contraseñas encriptadas
  const adminPasswordHash = await bcrypt.hash('Admin123*', 10);
  const userPasswordHash = await bcrypt.hash('User123*', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vinilosmilo.com' },
    update: {
      password: adminPasswordHash,
      role: Role.admin
    },
    create: {
      nombre: 'Administrador VinilosMilo',
      email: 'admin@vinilosmilo.com',
      password: adminPasswordHash,
      role: Role.admin
    }
  });
  console.log(`Usuario Admin listo: ${admin.email}`);

  const user = await prisma.user.upsert({
    where: { email: 'user@vinilosmilo.com' },
    update: {
      password: userPasswordHash,
      role: Role.user
    },
    create: {
      nombre: 'Camilo Cliente',
      email: 'user@vinilosmilo.com',
      password: userPasswordHash,
      role: Role.user
    }
  });
  console.log(`Usuario Normal listo: ${user.email}`);

  // 2. Insertar los 26 discos reales de la Entrega 1
  console.log(`Poblando ${catalogoDiscos.length} discos en el catálogo...`);
  for (const disco of catalogoDiscos) {
    const discoExistente = await prisma.disco.findFirst({
      where: {
        titulo: disco.titulo,
        artista: disco.artista
      }
    });

    if (!discoExistente) {
      await prisma.disco.create({
        data: disco
      });
    }
  }
  console.log('Catálogo de discos poblado correctamente.');

  // 3. Crear una interacción inicial de prueba (Pedido)
  const primerDisco = await prisma.disco.findFirst({
    where: { titulo: 'Intershibuya' }
  });

  if (primerDisco) {
    const pedidoExistente = await prisma.pedido.findFirst({
      where: {
        userId: user.id,
        discoId: primerDisco.id
      }
    });

    if (!pedidoExistente) {
      await prisma.pedido.create({
        data: {
          userId: user.id,
          discoId: primerDisco.id,
          cantidad: 1,
          mensaje: 'Reserva inicial para entrega en Apartadó',
          estado: 'PENDIENTE'
        }
      });
      console.log('Pedido de prueba creado para el usuario normal.');
    }
  }

  console.log('--- Seed completado exitosamente ---');
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
