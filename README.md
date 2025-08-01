# 🎓 Ranhentos Idiomas - School Management System

<div align="center">
    <img src="https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white">
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black">
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white">
    <img src="https://img.shields.io/badge/Docker-24-2496ED?style=for-the-badge&logo=docker&logoColor=white">
</div>

A complete school management system developed for Ranhentos Idiomas language school, with a Laravel backend and React frontend, containerized with Docker.

## 📋 Table of Contents

- [🏗️ Architecture](#️-architecture)
- [🚀 Technologies](#-technologies)
- [📁 Project Structure](#-project-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🔧 Features](#-features)
- [📊 Reports](#-reports)
- [🎨 User Interface](#-user-interface)
- [🔐 API & Validation](#-api--validation)
- [📱 Responsiveness](#-responsiveness)
- [🐳 Docker](#-docker)
- [📝 API Documentation](#-api-documentation)
- [📈 Project Status](#-project-status)
- [🤝 Contribution](#-contribution)

## 🏗️ Architecture

The project follows a modern microservices architecture with a clear separation between backend and frontend:

```
┌─────────────────┐    HTTP/REST     ┌─────────────────┐
│   Frontend      │ ◄──────────────► │    Backend      │
│   React 19      │    CORS          │   Laravel 11    │
│   TypeScript    │    Enabled       │   PHP 8.2+      │
└─────────────────┘                  └─────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │  PostgreSQL 15  │
                                     │   Database      │
                                     └─────────────────┘
```

## 🚀 Technologies

### Backend
- **Laravel 11** - Modern PHP framework
- **PHP 8.2+** - Backend language
- **PostgreSQL 15** - Relational database
- **UUID** - Universal unique identifiers
- **Laravel Request Validation** - Robust validation
- **Laravel Resource** - Data serialization
- **CORS Middleware** - Cross-origin communication

### Frontend
- **React 19** - UI library
- **TypeScript 5** - Typed JavaScript superset
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS 3** - Utility-first CSS framework
- **Lucide React** - Icon library
- **jsPDF + html2canvas** - PDF generation

### DevOps & Tools
- **Docker & Docker Compose** - Containerization
- **Nginx** - Web server
- **Vite** - Modern build tool
- **ESLint + Prettier** - Linting and formatting

## 📁 Project Structure

```
ranhentos-idiomas/
├── 📁 backend/                     # Laravel API
│   ├── 📁 app/
│   │   ├── 📁 Http/
│   │   │   ├── 📁 Controllers/Api/ # API Controllers
│   │   │   ├── 📁 Requests/        # Form Requests with validation
│   │   │   └── 📁 Middleware/      # CORS and logging
│   │   ├── 📁 Models/              # Eloquent Models
│   │   └── 📁 Traits/              # HasUuid trait
│   ├── 📁 database/
│   │   ├── 📁 migrations/          # Database structure
│   │   └── 📁 seeders/             # Sample data
│   ├── 📁 routes/api.php           # API routes
│   └── 📄 docker-compose.yml       # Docker configuration
├── 📁 frontend/                    # React application
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable components
│   │   ├── 📁 pages/               # Main pages
│   │   ├── 📁 services/            # API services
│   │   ├── 📁 hooks/               # Custom hooks
│   │   └── 📁 types/               # TypeScript types
│   ├── 📄 tailwind.config.js       # Tailwind config
│   └── 📄 package.json             # NPM dependencies
└── 📄 README.md                    # This documentation
```

## ⚙️ Installation & Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Git

### 🐳 Method 1: Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/DannyahIA/ranhentos-idiomas.git
cd ranhentos-idiomas

# 2. Configure the backend
cd backend
cp .env.example .env

# 3. Start the containers
docker-compose up -d

# 4. Install dependencies and setup
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed

# 5. Setup the frontend
cd ../frontend
npm install
npm start
```

### 💻 Method 2: Local Development

```bash
# Backend
cd backend
composer install
php artisan serve

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### 🔗 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/v1
- **Database**: localhost:5433

### 🔑 Environment Variables

```env
# backend/.env
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=mmtec
DB_USERNAME=postgres
DB_PASSWORD=password

# Enable CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

## 🔧 Features

### ✅ Implemented Features

#### 📚 Student Management
- ✅ Full registration with validation
- ✅ Edit and delete
- ✅ Paginated listing
- ✅ Search by name/email
- ✅ Responsive forms with modals

#### 📖 Course Management
- ✅ Full CRUD
- ✅ Detailed info (duration, price, description)
- ✅ Active/inactive status
- ✅ Organized visual cards

#### 📝 Enrollment System
- ✅ Enroll students in courses
- ✅ Status control (active, cancelled, completed)
- ✅ Duplicate validation
- ✅ Full history

#### 📊 Reports & Dashboard
- ✅ Dashboard with main statistics
- ✅ Total students, courses, enrollments
- ✅ Total revenue
- ✅ Visual charts
- ✅ **PDF export**

#### 🔌 RESTful API
- ✅ Complete endpoints for all entities
- ✅ Automatic pagination
- ✅ Loaded relationships
- ✅ Standardized JSON responses
- ✅ CORS configured

## 📊 Reports

The system has a complete reports module with:

### Main Dashboard
- **Totals**: Students, courses, active enrollments, revenue
- **Charts**: Status distribution, time evolution
- **Metrics**: Most popular courses, financial stats

### PDF Export
- Dynamic report generation
- Responsive and professional design
- Real-time updated data
- Direct browser download

```typescript
// PDF generation hook
const { generatePDF, isGenerating } = usePDFGenerator();

const handleExport = async () => {
    await generatePDF('reports-container', 'ranhentos-idiomas-report');
};
```

## 🎨 User Interface

### Design System
- **Color palette**: Primary blue (#2563eb) with gradients
- **Typography**: Inter font family
- **Components**: Modern modals with backdrop blur
- **Icons**: Lucide React (consistent and modern)
- **Layout**: Fixed sidebar + fluid content

### Main Components

#### Navigation Sidebar
```typescript
const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/' },
    { name: 'Students', icon: Users, path: '/students' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Enrollments', icon: UserPlus, path: '/enrollments' },
    { name: 'Reports', icon: FileText, path: '/reports' }
];
```

#### Responsive Modals
- Gradient header
- Responsive grid forms
- Real-time validation
- Visual feedback for actions

#### Data Cards
- Flexible layout
- Inline actions (edit/delete)
- Colored status badges
- Organized information

## 🔐 API & Validation

### Main Endpoints

```http
GET    /api/v1/students          # List students
POST   /api/v1/students          # Create student
GET    /api/v1/students/{id}     # Get student
PUT    /api/v1/students/{id}     # Update student
DELETE /api/v1/students/{id}     # Delete student

# Same structure for courses and enrollments
# Special endpoints for reports
GET    /api/v1/reports/dashboard
```

### Backend Validation

```php
// StoreStudentRequest.php
public function rules(): array
{
        return [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:students,email',
                'document_number' => 'required|string|unique:students,document_number',
                'birth_date' => 'nullable|date',
                'phone' => 'nullable|string|max:20',
                // ... more fields
        ];
}

public function messages(): array
{
        return [
                'name.required' => 'Name is required.',
                'email.email' => 'Email must be valid.',
                'email.unique' => 'This email is already in use.',
                // ... custom messages
        ];
}
```

### Frontend Error Handling

```typescript
// Global error handling interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 422) {
            // Show validation errors
            showValidationErrors(error.response.data.errors);
        }
        return Promise.reject(error);
    }
);
```

## 📱 Responsiveness

### Tailwind Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Device Adaptations

```css
/* Mobile First - Modals */
.modal {
    @apply fixed inset-0 bg-black/60 flex items-center justify-center p-4;
}

/* Desktop - Sidebar */
@media (min-width: 1024px) {
    .sidebar {
        @apply w-64 fixed left-0 top-0 h-full;
    }
    .main-content {
        @apply ml-64;
    }
}

/* Responsive Grids */
.grid-responsive {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

### Responsiveness Testing
- ✅ iPhone SE (375px)
- ✅ iPad (768px)
- ✅ Desktop (1920px)
- ✅ Adaptable forms
- ✅ Tables with horizontal scroll
- ✅ Mobile-friendly modals

## 🐳 Docker

### Multi-Container Setup

```yaml
# docker-compose.yml
services:
    app:
        build: .
        ports:
            - "8080:80"
        volumes:
            - .:/var/www/html
        depends_on:
            - db
            
    db:
        image: postgres:15
        environment:
            POSTGRES_DB: mmtec
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: password
        ports:
            - "5433:5432"
        volumes:
            - postgres_data:/var/lib/postgresql/data

    nginx:
        image: nginx:alpine
        ports:
            - "8080:80"
        volumes:
            - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf
```

### Development Scripts

```bash
# Useful commands
docker-compose exec app php artisan migrate:fresh --seed
docker-compose exec app php artisan tinker
docker-compose logs -f app
```

## 📝 API Documentation

### Standard Response Structure

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {
        "current_page": 1,
        "data": [...],
        "last_page": 5,
        "per_page": 15,
        "total": 67
    }
}
```

### Data Models

#### Student
```json
{
    "id": "uuid",
    "name": "string",
    "email": "string",
    "phone": "string|null",
    "birth_date": "date|null",
    "document_number": "string",
    "address": "string|null",
    "city": "string|null",
    "state": "string|null",
    "zip_code": "string|null",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

#### Course
```json
{
    "id": "uuid",
    "name": "string",
    "description": "string|null",
    "duration_hours": "integer",
    "price": "decimal",
    "max_students": "integer|null",
    "status": "active|inactive",
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

#### Enrollment
```json
{
    "id": "uuid",
    "student_id": "uuid",
    "course_id": "uuid",
    "start_date": "date",
    "price_paid": "decimal",
    "status": "active|cancelled|completed",
    "student": {...},
    "course": {...},
    "created_at": "datetime",
    "updated_at": "datetime"
}
```

## 📈 Project Status

### ✅ Mandatory Features Implemented

| Criteria | Status | Note |
|----------|--------|------|
| **Fully functional interface** | ✅ | Complete React + Laravel integration |
| **Backend validation** | ✅ | Form Requests with custom messages |
| **Success/error messages** | ✅ | Visual feedback for all actions |
| **Code organization** | ✅ | Modular and standardized structure |
| **Responsive interface** | ✅ | Mobile-first, tested on multiple devices |

### ⭐ Evaluation Criteria

| Criteria | Weight | Status | Implementation |
|----------|--------|--------|---------------|
| **Code clarity and organization** | ★★★★☆ | ✅ | Organized Controllers, Services, Components |
| **Correct database modeling** | ★★★★☆ | ✅ | Relationships, UUIDs, soft deletes |
| **API + Frontend integration** | ★★★★☆ | ✅ | CORS, TanStack Query, error handling |
| **Reports functionality** | ★★★☆☆ | ✅ | Dashboard + PDF export |
| **Laravel and React best practices** | ★★★☆☆ | ✅ | Form Requests, Hooks, TypeScript |
| **User experience** | ★★☆☆☆ | ✅ | Modern and intuitive interface |
| **Documentation** | ★★☆☆☆ | ✅ | Complete README with instructions |

### 🎯 Extra Features

- ✅ **Docker**: Full docker-compose setup
- ✅ **Client-side validation**: Real-time feedback
- ✅ **TypeScript**: Full typing on frontend
- ✅ **PDF Export**: Dynamic report generation
- ✅ **CORS**: Proper production setup
- ✅ **UUID**: Secure identifiers
- ✅ **Soft Deletes**: Reversible deletions
- ✅ **Pagination**: Optimized performance
- ✅ **Error Handling**: Robust error management

## 🚀 Deployment

### Production with Docker

```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# Frontend build
cd frontend
npm run build
```

### Production Environment Variables

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://ranhentos-idiomas.com

DB_HOST=production-db
CORS_ALLOWED_ORIGINS=https://ranhentos-idiomas.com
```

## 🤝 Contribution

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">
    <p>Developed with ❤️ for Ranhentos Idiomas</p>
    <p>
        <a href="https://github.com/DannyahIA">👨‍💻 Dannyah IA</a>
    </p>
</div>
