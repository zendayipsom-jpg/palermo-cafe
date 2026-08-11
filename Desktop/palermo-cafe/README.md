# Palermo Café — Website Premium Gastronómico

Plataforma web premium para **Palermo Café**, marca gastronómica peruana con más de 50 años de historia. Diseño de clase mundial con Next.js 15, panel administrativo, y todas las funcionalidades necesarias.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript |
| Estilos | Tailwind CSS 4 |
| Animaciones | Framer Motion |
| Componentes | shadcn/ui |
| ORM | Prisma 7.x |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (jose) + bcryptjs |
| Validación | Zod |

## Características

- **Diseño premium** con paleta de colores propia y tipografía Playfair Display + Inter
- **7 secciones en Home**: Hero, Historia, Menú, Experiencia, Locales, Reservas, Blog
- **4 páginas**: Carta, Reservas, Locales, Blog
- **Panel administrativo** con dashboard, gestión de productos, reservas y blog
- **API REST** completa con validación y rate limiting
- **Seguridad OWASP**: CSP headers, rate limiting, CSRF, sanitización
- **SEO**: Schema.org, OpenGraph, Twitter Cards, sitemap.xml, robots.txt
- **Accesibilidad**: WCAG 2.2 AA, ARIA labels, navegación por teclado
- **Mobile-first**: Responsive en todos los dispositivos
- **WhatsApp flotante** para contacto directo

## Instalación

```bash
# Clonar el proyecto
git clone <url>
cd palermo-cafe

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Generar cliente Prisma
npx prisma generate

# Crear base de datos y poblar datos iniciales
npx prisma db push
npx tsx prisma/seed.ts

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## Credenciales por Defecto

| Campo | Valor |
|-------|-------|
| Email | admin@palermocafe.pe |
| Contraseña | palermo2024 |

> ⚠️ Cambiar estas credenciales en producción

## Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Iniciar en producción
npm run lint         # Verificar código
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Poblar base de datos
npm run db:reset     # Resetear base de datos
npm run db:studio    # Abrir Prisma Studio
```

## Despliegue

### Vercel (Recomendado)

1. Subir a GitHub
2. Conectar repositorio en Vercel
3. Configurar variables de entorno:
   - `DATABASE_URL`: URL de PostgreSQL (Neon, Supabase, etc.)
   - `JWT_SECRET`: Secreto fuerte para JWT
4. Deploy automático

### Producción

```bash
npm run build
npm start
```

## Licencia

Proyecto privado — Palermo Café © 2024
