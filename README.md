# 📚 Books Library Management System

A modern, full-stack library management system built with Nuxt 3, TypeScript, and Supabase. This application demonstrates advanced web development skills including real-time data synchronization, role-based authentication, and comprehensive CRUD operations.

## 🌟 Live Demo

🔗 **[View Live Application](https://cuongdinhngo.github.io/books-app/)**

## ✨ Features

### 📖 Library Management
- **Complete Book Management**: CRUD operations with cover images, descriptions, and preview files
- **Author & Publisher Management**: Comprehensive profiles with photos and biographical information
- **Category System**: Organized book classification and filtering
- **Inventory Tracking**: Physical book copy management with status tracking (pending, available, lost, retired)

### 👥 User Management & Authentication
- **Dual Role System**: Separate interfaces for library staff and readers
- **Secure Authentication**: Supabase-based authentication with role-based access control
- **User Profiles**: Complete profile management with photo uploads

### 📋 Advanced Borrowing System
- **Order Lifecycle Management**: Complete workflow from request to return
- **Due Date Management**: Automatic 7-14 day borrowing periods
- **Renewal Requests**: Extension system with staff approval workflow
- **Order Timeline**: Complete audit trail of all borrowing activities
- **Real-time Notifications**: Instant updates for order status changes

### 🔍 Search & Discovery
- **Advanced Search**: Multi-criteria search by title, author, category, and publisher
- **Smart Filtering**: Dynamic filtering with real-time results
- **Top Ratings System**: Books ranked by user reviews and ratings
- **Explore Pages**: Browse collections by categories, authors, and publishers
- **Wishlist & Cart**: Save and manage book selections

### 📊 Analytics & Reporting
- **Admin Dashboard**: Comprehensive overview with statistics and charts
- **Book Analytics**: Borrowing patterns and popularity metrics
- **User Analytics**: Reader activity and borrowing history
- **Visual Reports**: Interactive charts for data visualization

### 🎨 Modern User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: Live data synchronization with Supabase
- **Dynamic Navigation**: Context-aware breadcrumbs and routing
- **Rich Media Support**: Image uploads, QR code generation
- **Efficient Pagination**: Optimized data loading and navigation

## 🛠️ Technology Stack

### Frontend
- **Framework**: Nuxt 3 (Vue.js)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Nuxt UI
- **State Management**: Vue 3 Composition API + Composables
- **Icons**: Lucide Icons
- **Charts**: Nuxt Charts for data visualization

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for file uploads
- **Real-time**: Supabase real-time subscriptions

### Development Tools
- **Build Tool**: Vite
- **Type Safety**: Full TypeScript support
- **Code Quality**: ESLint configuration
- **Data Seeding**: Faker.js for mock data generation

## 🏗️ Architecture Highlights

### Database Design
- **Relational Structure**: Well-normalized database with proper foreign key relationships
- **Junction Tables**: Many-to-many relationships for books-authors, books-categories
- **Audit Trail**: Complete order timeline tracking
- **Security**: Row Level Security (RLS) implementation

### Code Organization
- **Composables Pattern**: Reusable business logic with Vue 3 Composition API
- **Component Architecture**: Modular, reusable Vue components
- **Type Safety**: Full TypeScript integration with generated database types
- **Middleware**: Authentication and navigation guards

### Performance Optimizations
- **Lazy Loading**: Efficient data fetching with `useAsyncData`
- **Image Optimization**: Supabase storage integration
- **Pagination**: Server-side pagination for large datasets
- **Caching**: Smart data caching strategies

## 🚀 Setup

### Prerequisites
- Node.js 18+ 
- npm/pnpm/yarn/bun
- Supabase account and project

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/cuongdinhngo/books-app.git
cd books-app
```

2. **Install dependencies**

```bash
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

3. **Environment Setup**

Create a `.env` file in the root directory:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
APP_URL=http://localhost:3000
```

4. **Database Setup**

Generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > types/database.types.ts
```

5. **Database Seeding**

Populate your database with sample data:
```bash
node commands/general-seeder.mjs --truncate
node commands/order-seeder.mjs --truncate
```

## 🧑‍💻 Development

**Start the development server** on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## 🏭 Production

**Build the application** for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

**Preview production build** locally:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## 📸 Screenshots

### 🏠 Home Page - Book Discovery
- Browse featured books and top-rated collections
- Advanced search and filtering capabilities
- Responsive grid layout for optimal viewing

### 👨‍💼 Admin Dashboard
- Comprehensive statistics and analytics
- Real-time charts and data visualization
- Complete library management interface

### 📖 Book Details
- Detailed book information with cover images
- User reviews and rating system
- Borrowing status and availability

### 📋 Order Management
- Complete borrowing workflow
- Order timeline and status tracking
- Renewal request system

## 🎯 Key Development Decisions

### Architecture Choices
- **Nuxt 3**: Chosen for its excellent TypeScript support, file-based routing, and SSR capabilities
- **Supabase**: Selected for real-time capabilities, built-in authentication, and PostgreSQL reliability
- **Composables Pattern**: Implemented for clean separation of concerns and reusable business logic
- **Component-First Design**: Modular architecture for maintainability and reusability

### Database Design
- **Normalized Structure**: Proper relational design with foreign key constraints
- **Audit Trail**: Complete order timeline for accountability and tracking
- **Status Management**: Enum-like constants for consistent state management
- **Flexible Relationships**: Many-to-many relationships for books-authors and books-categories

### User Experience
- **Role-Based UI**: Different interfaces optimized for staff and readers
- **Real-time Updates**: Instant notifications and data synchronization
- **Mobile-First**: Responsive design ensuring great experience across devices
- **Performance**: Lazy loading and pagination for optimal performance

## � Advanced Features

### Real-time Notifications
- Instant updates for order status changes
- Staff notifications for new borrowing requests
- Reader notifications for due dates and approvals

### Search & Discovery
- Full-text search across books, authors, and categories
- Advanced filtering with multiple criteria
- Recommendation system based on categories and ratings

### Analytics & Reporting
- Admin dashboard with comprehensive statistics
- Visual charts for borrowing patterns
- User activity tracking and reporting

### Security
- Role-based access control
- Supabase Row Level Security (RLS)
- Authentication middleware for route protection

## �👨‍💻 About the Developer

**Cuong Dinh Ngo** - Full Stack Developer

This project showcases my expertise in:
- � **Modern Web Development**: Nuxt 3, Vue.js, TypeScript
- 🗄️ **Database Design**: PostgreSQL, Supabase, relational modeling
- 🔐 **Authentication & Security**: Role-based access control, RLS
- 📊 **Data Visualization**: Charts, analytics, and reporting
- 🎨 **UI/UX Design**: Responsive design, user experience optimization
- ⚡ **Performance**: Real-time updates, efficient data loading
- 🏗️ **Architecture**: Scalable, maintainable code organization

### Connect with Me
- �🌐 **Portfolio**: [cuongdinhngo.github.io](https://cuongdinhngo.github.io/)
- 💼 **GitHub**: [@cuongdinhngo](https://github.com/cuongdinhngo)
- 📧 **Email**: dinhcuongngo@gmail.com
- 💬 **LinkedIn**: [Connect with me](https://www.linkedin.com/in/ngodinhcuong/)

---

⭐ **If you found this project helpful, please consider giving it a star!**

**Built with ❤️ and lots of ☕ by [Cuong Dinh Ngo](https://cuongdinhngo.github.io/)**