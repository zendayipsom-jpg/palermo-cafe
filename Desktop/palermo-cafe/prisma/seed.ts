import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env["DATABASE_URL"]!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // Create Admin User
  // ============================================
  // ⚠️ SECURITY: Contraseña generada aleatoriamente. Cambiar después del primer login.
  const adminPassword = await hash("Be#yA7Vj!BBRBe9df69o", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@palermocafe.pe" },
    update: {},
    create: {
      email: "admin@palermocafe.pe",
      name: "Administrador",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log("✅ Admin user created:", admin.email);
  console.log("🔐 Admin password: Be#yA7Vj!BBRBe9df69o");
  console.log("⚠️  Cambia esta contraseña después del primer login en /auth/login");

  // ============================================
  // Create Products
  // ============================================
  const products = [
    // =============================================
    // Sándwiches
    // =============================================
    {
      name: "Sándwich de Chicharrón",
      description:
        "Nuestro clásico sándwich de chicharrón con cortes de cerdo, rodajas de camote y salsa de cebolla.",
      price: 18.5,
      category: "sandwiches",
      image: "/images/sandwich-chicharron-clasico.jpg",
      featured: true,
      order: 1,
    },
    {
      name: "Sándwich de Jamón del País",
      description:
        "Cortes de jamón del país, salsa de cebolla, un trozo de ají y lechuga.",
      price: 18.5,
      category: "sandwiches",
      image: "/images/sandwich-jamon-pais.jpg",
      featured: true,
      order: 2,
    },
    {
      name: "Sándwich de Pollo",
      description:
        "Pollo deshilachado, lechuga fresca y mayonesa de la casa.",
      price: 18.5,
      category: "sandwiches",
      image: "/images/sandwich-pollo-desmenuzado.jpg",
      featured: false,
      order: 3,
    },
    {
      name: "Sándwich de Pavo",
      description:
        "Pavo marinado y aderezado, lechuga fresca.",
      price: 18.5,
      category: "sandwiches",
      image: "/images/sandwich-de-pavo.jpg",
      featured: false,
      order: 4,
    },
    {
      name: "Sándwich de Asado",
      description:
        "Asado aderezado, salsa de cebolla y fresca lechuga.",
      price: 18.5,
      category: "sandwiches",
      image: "/images/sandwich-tradicional.jpg",
      featured: false,
      order: 5,
    },
    {
      name: "Sándwich de Lomo Fino",
      description:
        "Trozos de Lomo Fino marinados en salsa especial, salteados con cebolla blanca y queso derretido.",
      price: 22.5,
      category: "sandwiches",
      image: "/images/sandwich-lomo-fino.jpg",
      featured: true,
      order: 6,
    },
    {
      name: "Hamburguesa",
      description:
        "Hamburguesa especial con lechuga, tomate y mayonesa.",
      price: 18.5,
      category: "sandwiches",
      image: "/images/hamburguesa-clasica.jpg",
      featured: false,
      order: 7,
    },

    // =============================================
    // Palermitos (mini sándwiches)
    // =============================================
    {
      name: "Palermito de Chicharrón",
      description:
        "Versión mini de nuestro clásico sándwich de chicharrón.",
      price: 13.5,
      category: "palermitos",
      image: "/images/sandwich-chicharron-clasico.jpg",
      featured: true,
      order: 8,
    },
    {
      name: "Palermito de Jamón del País",
      description:
        "Versión mini de nuestro sándwich de jamón del país.",
      price: 13.5,
      category: "palermitos",
      image: "/images/sandwich-jamon-pais.jpg",
      featured: true,
      order: 9,
    },

    // =============================================
    // Desayunos / Adicionales
    // =============================================
    {
      name: "Tamal de Chancho",
      description:
        "Tamal criollo de maíz con trozos de chancho.",
      price: 16.0,
      category: "desayunos",
      image: "/images/tamal-amarillo-porcion.jpg",
      featured: true,
      order: 10,
    },
    {
      name: "Tamal de Pollo",
      description:
        "Tamal criollo de maíz con trozos de pollo.",
      price: 16.0,
      category: "desayunos",
      image: "/images/tamal-verde.jpg",
      featured: false,
      order: 11,
    },
    {
      name: "Porción de Camote",
      description:
        "Porción de camote frito en rodajas.",
      price: 10.0,
      category: "desayunos",
      image: "/images/papas-fritas-con-queso.jpg",
      featured: false,
      order: 12,
    },
    {
      name: "1/2 Porción de Camote",
      description:
        "Media porción de camote frito en rodajas.",
      price: 5.0,
      category: "desayunos",
      image: "/images/papas-crocantes.jpg",
      featured: false,
      order: 13,
    },
    {
      name: "Porción de Salsa de Cebolla",
      description:
        "Porción de salsa de cebolla en rodajas.",
      price: 7.0,
      category: "desayunos",
      image: "/images/papas-con-salsa.jpg",
      featured: false,
      order: 14,
    },
    {
      name: "Ají de la Casa 4oz",
      description:
        "Ají de la casa preparado, porción de 4oz.",
      price: 3.0,
      category: "desayunos",
      image: "/images/papa-rellena-aji.jpg",
      featured: false,
      order: 15,
    },
    {
      name: "Mayonesa de la Casa 4oz",
      description:
        "Mayonesa de la casa preparada, porción de 4oz.",
      price: 3.0,
      category: "desayunos",
      image: "/images/papas-con-mayo.jpg",
      featured: false,
      order: 16,
    },
    {
      name: "Unidad de Pan",
      description:
        "Pan fresco para sándwich.",
      price: 1.5,
      category: "desayunos",
      image: "/images/pan-con-chicharron.jpg",
      featured: false,
      order: 17,
    },

    // =============================================
    // Bebidas Calientes
    // =============================================
    {
      name: "Café",
      description:
        "Café peruano tostado artesanalmente.",
      price: 7.0,
      category: "bebidas",
      image: "/images/cafe-espresso-preparacion.jpg",
      featured: false,
      order: 18,
    },
    {
      name: "Café con Leche",
      description:
        "Café con leche cremoso.",
      price: 7.5,
      category: "bebidas",
      image: "/images/cafe-portafiltro-granos.jpg",
      featured: false,
      order: 19,
    },
    {
      name: "Cappuccino",
      description:
        "Cappuccino cremoso con espuma de leche.",
      price: 8.5,
      category: "bebidas",
      image: "/images/cafe-portafiltro-granos.jpg",
      featured: false,
      order: 20,
    },
    {
      name: "Té",
      description:
        "Té caliente variado.",
      price: 7.0,
      category: "bebidas",
      image: null,
      featured: false,
      order: 21,
    },
    {
      name: "Manzanilla",
      description:
        "Manzanilla caliente.",
      price: 7.0,
      category: "bebidas",
      image: null,
      featured: false,
      order: 22,
    },
    {
      name: "Anís",
      description:
        "Anís caliente.",
      price: 7.0,
      category: "bebidas",
      image: null,
      featured: false,
      order: 23,
    },

    // =============================================
    // Bebidas Frías
    // =============================================
    {
      name: "Chicha Morada",
      description:
        "Refrescante chicha morada tradicional.",
      price: 9.5,
      category: "bebidas",
      image: null,
      featured: true,
      order: 24,
    },
    {
      name: "Gaseosa",
      description:
        "Gaseosa personal.",
      price: 4.0,
      category: "bebidas",
      image: null,
      featured: false,
      order: 25,
    },
    {
      name: "Agua con Gas",
      description:
        "Agua con gas.",
      price: 4.0,
      category: "bebidas",
      image: null,
      featured: false,
      order: 26,
    },
    {
      name: "Agua Sin Gas",
      description:
        "Agua sin gas.",
      price: 3.0,
      category: "bebidas",
      image: null,
      featured: false,
      order: 27,
    },
    {
      name: "Café Helado",
      description:
        "Café helado refrescante.",
      price: 11.5,
      category: "bebidas",
      image: "/images/cafe-espresso-preparacion.jpg",
      featured: false,
      order: 28,
    },
    {
      name: "Latte Helado",
      description:
        "Café con leche frío.",
      price: 13.5,
      category: "bebidas",
      image: "/images/cafe-portafiltro-granos.jpg",
      featured: false,
      order: 29,
    },
    {
      name: "Milkshake",
      description:
        "Milkshake cremoso. Sabores: vainilla, fresa, lúcuma o chocolate.",
      price: 14.0,
      category: "bebidas",
      image: null,
      featured: true,
      order: 30,
    },
    {
      name: "Limonada",
      description:
        "Limonada natural refrescante.",
      price: 9.5,
      category: "bebidas",
      image: null,
      featured: false,
      order: 31,
    },

    // =============================================
    // Jugos
    // =============================================
    {
      name: "Jugo de Papaya",
      description:
        "Jugo natural de papaya.",
      price: 11.5,
      category: "jugos",
      image: null,
      featured: false,
      order: 32,
    },
    {
      name: "Jugo de Naranja",
      description:
        "Jugo natural de naranja.",
      price: 11.5,
      category: "jugos",
      image: null,
      featured: false,
      order: 33,
    },
    {
      name: "Jugo de Piña",
      description:
        "Jugo natural de piña.",
      price: 11.5,
      category: "jugos",
      image: null,
      featured: false,
      order: 34,
    },
    {
      name: "Jugo de Maracuyá",
      description:
        "Jugo natural de maracuyá.",
      price: 11.5,
      category: "jugos",
      image: null,
      featured: false,
      order: 35,
    },
    {
      name: "Jugo de Fresa",
      description:
        "Jugo natural de fresa.",
      price: 13.0,
      category: "jugos",
      image: null,
      featured: false,
      order: 36,
    },
    {
      name: "Jugo de Zanahoria",
      description:
        "Jugo natural de zanahoria.",
      price: 11.5,
      category: "jugos",
      image: null,
      featured: false,
      order: 37,
    },
    {
      name: "Jugo de Mango",
      description:
        "Jugo natural de mango.",
      price: 13.0,
      category: "jugos",
      image: null,
      featured: false,
      order: 38,
    },
    {
      name: "Jugo de Chirimoya",
      description:
        "Jugo natural de chirimoya.",
      price: 15.0,
      category: "jugos",
      image: null,
      featured: false,
      order: 39,
    },
    {
      name: "Jugo de Sandía",
      description:
        "Jugo natural de sandía.",
      price: 13.0,
      category: "jugos",
      image: null,
      featured: false,
      order: 40,
    },
    {
      name: "Jugo de Melocotón",
      description:
        "Jugo natural de melocotón.",
      price: 13.0,
      category: "jugos",
      image: null,
      featured: false,
      order: 41,
    },
    {
      name: "Jugo de Piña con Naranja",
      description:
        "Jugo natural mixto de piña y naranja.",
      price: 13.0,
      category: "jugos",
      image: null,
      featured: false,
      order: 42,
    },
    {
      name: "Jugo de Granadilla",
      description:
        "Jugo natural de granadilla.",
      price: 15.0,
      category: "jugos",
      image: null,
      featured: false,
      order: 43,
    },

    // =============================================
    // Postres
    // =============================================
    {
      name: "Alfajor",
      description:
        "Alfajor de harina con manjar blanco auténtico y azúcar en polvo.",
      price: 7.0,
      category: "postres",
      image: null,
      featured: true,
      order: 44,
    },
    {
      name: "Brownie",
      description:
        "Brownie de chocolate con azúcar en polvo.",
      price: 10.0,
      category: "postres",
      image: null,
      featured: false,
      order: 45,
    },
    {
      name: "Crema Volteada",
      description:
        "Postre tradicional de crema volteada con caramelo.",
      price: 10.0,
      category: "postres",
      image: null,
      featured: false,
      order: 46,
    },
    {
      name: "Arroz Zambito",
      description:
        "Arroz zambito tradicional, postre de arroz con chancaca.",
      price: 10.0,
      category: "postres",
      image: null,
      featured: false,
      order: 47,
    },
    {
      name: "Tres Leches",
      description:
        "Postre de tres leches con canela y merengue.",
      price: 10.0,
      category: "postres",
      image: null,
      featured: false,
      order: 48,
    },
    {
      name: "Pionono",
      description:
        "Pionono relleno de manjar blanco.",
      price: 10.0,
      category: "postres",
      image: null,
      featured: false,
      order: 49,
    },
    {
      name: "Leche Asada",
      description:
        "Postre tradicional con leche, huevos y caramelo.",
      price: 9.5,
      category: "postres",
      image: null,
      featured: false,
      order: 50,
    },
    {
      name: "Guargüero",
      description:
        "Guargüero relleno de manjar blanco y azúcar en polvo.",
      price: 9.5,
      category: "postres",
      image: null,
      featured: false,
      order: 51,
    },
    {
      name: "Milhojas",
      description:
        "Milhojas de hojaldre con manjar blanco.",
      price: 10.0,
      category: "postres",
      image: null,
      featured: false,
      order: 52,
    },
    {
      name: "Chocolate Caliente",
      description:
        "Chocolate caliente espeso con leche.",
      price: 8.5,
      category: "postres",
      image: null,
      featured: false,
      order: 53,
    },
  ];

  for (const product of products) {
    const id = product.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await prisma.product.upsert({
      where: { id },
      update: product,
      create: {
        id,
        ...product,
      },
    });
  }
  console.log("✅ Products created:", products.length);

  // ============================================
  // Create Locations
  // ============================================
  const locations = [
    {
      name: "La Victoria",
      address: "Av. Palermo 270",
      district: "La Victoria",
      phone: "(01) 123-4567",
      hours: "Lun-Sáb 8:00 AM - 8:45 PM",
      mapUrl: "https://maps.google.com/?q=Av+Palermo+270+La+Victoria+Lima",
      lat: -12.0833,
      lng: -77.0,
      order: 1,
    },
    {
      name: "Miraflores",
      address: "Av. Alfredo Benavides 2518",
      district: "Miraflores",
      phone: "(01) 234-5678",
      hours: "Lun-Sáb 7:30 AM - 9:30 PM | Dom 7:30 AM - 1:00 PM",
      mapUrl: "https://maps.google.com/?q=Av+Benavides+2518+Miraflores+Lima",
      lat: -12.1191,
      lng: -77.0298,
      order: 2,
    },
    {
      name: "San Borja",
      address: "Av. San Borja Norte 417",
      district: "San Borja",
      phone: "(01) 345-6789",
      hours: "Lun-Sáb 7:30 AM - 7:30 PM | Dom 7:30 AM - 1:00 PM",
      mapUrl: "https://maps.google.com/?q=Av+San+Borja+Norte+417+San+Borja+Lima",
      lat: -12.0933,
      lng: -77.0,
      order: 3,
    },
    {
      name: "Surco",
      address: "Jr. El Polo 255",
      district: "Santiago de Surco",
      phone: "(01) 456-7890",
      hours: "Lun-Sáb 7:00 AM - 9:00 PM | Dom 7:30 AM - 1:00 PM",
      mapUrl: "https://maps.google.com/?q=Jr+El+Polo+255+Santiago+de+Surco+Lima",
      lat: -12.1333,
      lng: -77.0,
      order: 4,
    },
  ];

  for (const location of locations) {
    const id = location.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    await prisma.location.upsert({
      where: { id },
      update: location,
      create: {
        id,
        ...location,
      },
    });
  }
  console.log("✅ Locations created:", locations.length);

  // ============================================
  // Create Blog Posts
  // ============================================
  const blogPosts = [
    {
      title: "La Historia del Sándwich Peruano",
      slug: "historia-del-sandwich-peruano",
      excerpt:
        "Descubre cómo el sándwich peruano se convirtió en un ícono gastronómico que une a familias desde hace más de 50 años.",
      content: `
        <h2>Un legado de sabor</h2>
        <p>El sándwich peruano es mucho más que comida rápida. Es una tradición que se ha pasado de generación en generación, manteniendo los sabores auténticos que nos definen como cultura.</p>
        <p>En Palermo Café, desde 1974, hemos sido testigos de cómo esta tradición ha crecido. Nuestros primeros sándwiches se preparaban en Balconcillo, La Victoria, frente a los clientes que esperaban ansiosos por probar esos sabores únicos.</p>
        <h2>La receta secreta</h2>
        <p>Lo que hace especial a un sándwich peruano no es solo el pan fresco o el relleno generoso. Es la combinación perfecta de especias, la frescura de los ingredientes y ese toque especial que solo la tradición puede dar.</p>
        <p>Cada sándwich que preparamos lleva el cariño de más de medio siglo de experiencia. No es solo cocina, es arte gastronómico.</p>
        <h2>Tradición y modernidad</h2>
        <p>Hoy, mientras honramos nuestras raíces, también innovamos. Porque la tradición no está peleada con la calidad y la presentación moderna. En Palermo Café encontrás lo mejor de ambos mundos.</p>
      `,
      published: true,
      tags: "historia, tradición, sándwich peruano",
      metaTitle: "La Historia del Sándwich Peruano | Palermo Café",
      metaDesc: "Descubre la historia del sándwich peruano y cómo Palermo Café ha mantenido la tradición desde 1974.",
    },
    {
      title: "La Tradición Limeña en Cada Bocado",
      slug: "tradicion-limena-en-cada-bocado",
      excerpt:
        "Cómo los sabores limeños han cruzado generaciones y se mantienen vivos en cada uno de nuestros locales.",
      content: `
        <h2>Lima, ciudad de sabores</h2>
        <p>Lima es una ciudad que se vive a través de sus sabores. Desde los mercados más populares hasta los restaurantes más elegantes, la gastronomía limeña es un reflejo de nuestra historia multicultural.</p>
        <p>En Palermo Café hemos capturado esa esencia. Cada local es un pedazo de historia limeña, donde los abuelos traen a sus nietos a probar los mismos sabores que disfrutaron en su juventud.</p>
        <h2>Los sabores que nos unen</h2>
        <p>El chicharrón crujiente, el jamón del país, el café aromático... son sabores que trascienden las generaciones. No importa si tenés 15 o 75 años, estos sabores despiertan recuerdos y sonrisas.</p>
        <p>Es por eso que cada bocado en Palermo Café es una experiencia emocional, no solo gastronómica.</p>
      `,
      published: true,
      tags: "lima, tradición, gastronomía",
      metaTitle: "La Tradición Limeña en Cada Bocado | Palermo Café",
      metaDesc: "Conoce cómo los sabores limeños mantienen viva la tradición en Palermo Café.",
    },
    {
      title: "Cultura Gastronómica Peruana",
      slug: "cultura-gastronomica-peruana",
      excerpt:
        "El Perú es reconocido mundialmente por su gastronomía. Descubre por qué somos una potencia culinaria.",
      content: `
        <h2>Patrimonio gastronómico</h2>
        <p>La gastronomía peruana ha sido reconocida como Patrimonio Cultural Inmaterial de la Humanidad. Y no es para menos. Nuestra cocina es una fusión única de influencias indígenas, africanas, asiáticas y europeas.</p>
        <p>Desde el ceviche hasta el lomo saltado, cada plato cuenta una historia de mezcla cultural que ha creado algo verdaderamente único en el mundo.</p>
        <h2>Palermo Café como embajador</h2>
        <p>En Palermo Café nos enorgullece ser parte de esta tradición gastronómica. Nuestros sándwiches, tamales y bebidas son representantes de esa cultura culinaria que nos caracteriza.</p>
        <p>Cada ingrediente seleccionado, cada receta perfeccionada, cada sonrisa de nuestros clientes... todo es parte de esta gran historia gastronómica que seguimos escribiendo día a día.</p>
      `,
      published: true,
      tags: "gastronomía, Perú, cultura",
      metaTitle: "Cultura Gastronómica Peruana | Palermo Café",
      metaDesc: "Descubre la rica cultura gastronómica peruana y el papel de Palermo Café en ella.",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: {
        id: post.slug,
        ...post,
      },
    });
  }
  console.log("✅ Blog posts created:", blogPosts.length);

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
