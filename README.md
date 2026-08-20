# Shoppy Cart - E-Commerce Platform

A modern, full-featured e-commerce platform built as a college project to showcase advanced web development skills and best practices. Shoppy Cart demonstrates production-level architecture with secure authentication, role-based access control, and optimized performance.

## 🎯 Project Overview

Shoppy Cart is a comprehensive e-commerce solution designed to showcase how modern web technologies can be combined to create a scalable, secure, and user-friendly shopping platform. The project emphasizes professional development practices including advanced security patterns, efficient data fetching, and intuitive user experiences.

**Perfect for:**
- Portfolio demonstrations
- Learning full-stack development
- Understanding enterprise-level architecture patterns
- Exploring advanced authentication mechanisms

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: Tailwind CSS
- **Animations**: Motion
- **Form Handling**: React Hook Form + Zod validation
- **Carousel**: Embla Carousel with Autoplay
- **Tables**: TanStack React Table
- **Drag & Drop**: dnd-kit

### Backend
- **Framework**: Spring Boot
- **Language**: Java
- **Database**: MySQL

### Security & Auth
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: OAuth
- **Token Strategy**: Refresh Token + Access Token
- **OTP**: OTP-based registration

## ✨ Key Features

### 🔐 Advanced Security Architecture
- **Dual Token System**: Implements both access tokens and refresh tokens for enhanced security
- **JWT-based Authentication**: Secure token-based authentication mechanism
- **OAuth Integration**: Support for OAuth providers
- **OTP Verification**: One-Time Password for seller and affiliate registration, wallet access
- **Secure Session Management**: Automatic token refresh with fallback mechanisms
- **Middleware Protection**: Route-level middleware that validates authentication and user roles

### 👥 Multi-Role System
A unique, flexible role system that allows users to have multiple identities:
- **User Role**: Default role for shoppers
- **Seller Role**: Users can become sellers to list and sell products
- **Affiliate Role**: Users can participate in affiliate marketing
- **Role Restrictions**: Users can be both User + Seller, or User + Affiliate, but Sellers cannot be Affiliates

Each role is independently managed with OTP-based registration.

### 💰 Wallet System
- Unified wallet for all user types
- Transaction history and balance tracking
- OTP-based wallet operations
- Support for multiple payment scenarios

### 📊 Advanced Data Handling
- **Pagination**: Efficient data loading with page-based navigation
- **Infinite Scroll**: Seamless infinite scrolling for product browsing
- **Frontend Caching**: TanStack Query handles intelligent caching and data synchronization
- **Next.js Optimization**: Leverages Next.js built-in caching mechanisms
- **Auto-fetch**: Automatic data fetching when users scroll near the end of a list

### 🎠 Enhanced User Experience
- **Paginated Carousel**: Interactive carousel with pagination controls
- **Auto-loading**: Automatically loads next data batch during pagination
- **Responsive Design**: Mobile-first approach with seamless responsive behavior
- **Smooth Animations**: Motion library for polished UI transitions
- **Real-time Updates**: Live data synchronization across the platform

## 🏗 Architecture Highlights

### Authentication Flow
```
Login/Register
    ↓
Generate Access Token + Refresh Token
    ↓
Store Refresh Token in HttpOnly Cookie
    ↓
Use Access Token for API requests
    ↓
Auto-refresh on 401 Response
```

### Role-Based Access Control
```
Protected Routes
    ├─ Standard Routes (/cart, /profile, etc.)
    │  └─ Requires: Refresh Token
    │
    ├─ Setup Routes (/seller/register, /affiliate/register)
    │  └─ Requires: Refresh Token + OTP ID Cookie
    │
    └─ Role Routes (/seller/*, /affiliate/*)
       └─ Requires: Refresh Token + Role Account Cookie
```

### Data Fetching Strategy
- **TanStack Query**: Handles caching, background refetching, and synchronization
- **Automatic Stale Data Handling**: Stale-while-revalidate pattern
- **Request Deduplication**: Multiple identical requests are batched
- **Pagination Support**: Efficient handling of large datasets
- **Custom Fetch Utilities**: Enhanced fetch wrapper with token management

## 📱 Main Features by Module

### Shopping
- Browse products with pagination and infinite scroll
- Search and filter capabilities
- Add to cart and wishlist
- Product recommendations

### Seller Dashboard
- Product management
- Order tracking
- Sales analytics
- Revenue management

### Affiliate Program
- Referral link generation with QR codes
- Commission tracking
- Affiliate statistics
- Payment processing

### User Account
- Profile management
- Multiple address management
- Order history
- Wallet management
- Transaction history

## 🔄 Middleware & Route Protection

The application uses Next.js middleware (`proxy.ts`) to handle:
- Authentication verification
- Role validation
- Setup flow management
- Redirect logic for unauthorized access
- Session state checking

## 📦 Dependencies

**Core Dependencies:**
- next: 16.2.6
- react: 19.2.4
- typescript: 5
- tailwindcss: 4

**State & Data:**
- zustand: 5.0.14
- @tanstack/react-query: 5.101.0
- @tanstack/react-table: 8.21.3

**UI & Components:**
- shadcn: 4.13.0
- lucide-react: 1.17.0
- motion: 12.42.2

**Forms & Validation:**
- react-hook-form: 7.77.0
- zod: 4.4.3

See `frontend/package.json` for complete dependency list.

## 🎨 Design System

- **Component Library**: Built on shadcn/ui for consistency and accessibility
- **Styling**: Tailwind CSS v4 with custom theme configuration
- **Color System**: Modern color palette using oklch color space
- **Responsive Design**: Mobile-first breakpoints (xs, sm, md, lg, xl, 2xl)
- **Typography**: Inter font for body, Geist Mono for code
- **Animations**: Smooth transitions with Motion library

## 🚀 Performance Optimizations

1. **Image Optimization**: Next.js Image component with lazy loading
2. **Code Splitting**: Automatic route-based code splitting
3. **Request Optimization**: Timeout management and error handling
4. **Caching Strategy**: Multi-layered caching with TanStack Query
5. **Bundle Size**: Optimized dependencies and tree-shaking

## 📋 Project Structure

```
shoppy-cart/
├── frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── sections/            # Page sections (Hero, etc.)
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Utility functions
│   ├── store/               # Zustand store
│   ├── providers/           # Context providers
│   ├── proxy.ts             # Middleware configuration
│   └── package.json         # Dependencies
└── [backend-folder]/        # Spring Boot backend
```

## 🔑 Key Implementation Details

### Token Management (`lib/utils.ts`)
- Automatic token refresh on 401 responses
- Request timeout handling (60 seconds default)
- Deduplication of concurrent refresh requests
- Secure logout with cookie clearing

### API Communication
- Custom `apiFetch` wrapper for authenticated requests
- Automatic authorization header injection
- Error handling and token refresh logic
- Timeout management to prevent hanging requests

### State Management (Zustand)
- Lightweight alternative to Redux
- Access token storage
- User information caching
- Role-specific state

## 💡 Learning Outcomes

This project demonstrates:
- ✅ Full-stack web application development
- ✅ Secure authentication implementation
- ✅ Advanced routing and middleware patterns
- ✅ TypeScript for type-safe development
- ✅ Modern React patterns and hooks
- ✅ Performance optimization techniques
- ✅ Responsive and accessible UI design
- ✅ State management best practices
- ✅ API integration and error handling
- ✅ Database design and management

## 📝 Code Quality

- **Linting**: ESLint with Next.js and TypeScript configurations
- **Formatting**: Prettier with automatic Tailwind class sorting
- **Type Safety**: Full TypeScript implementation
- **Testing**: Husky pre-commit hooks

## 🎓 Educational Value

Shoppy Cart is designed as a comprehensive learning resource that covers:
- Industry-standard authentication mechanisms
- Scalable backend architecture with Spring Boot
- Modern frontend development with Next.js
- Database design and optimization
- Security best practices
- Performance optimization strategies
- Professional code organization and practices

## 👨‍💻 Developer

**Created by**: Hariom Kashyap

## 📄 License

This project is created as a college project for educational purposes.

---

**Note**: This is a learning project designed to showcase full-stack development capabilities and best practices in building modern e-commerce platforms.
