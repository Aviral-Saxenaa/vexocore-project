# 🚀 VexoCore Task Manager

A modern, full-stack task management application built with React, Express.js, and PostgreSQL. Features user authentication, real-time task management, and comprehensive testing.

![VexoCore Task Manager](https://img.shields.io/badge/Status-Live%20on%20Render-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![License](https://img.shields.io/badge/License-ISC-blue)
![Live Demo](https://img.shields.io/badge/Live%20Demo-https://vexocore--project.onrender.com-blue)

## 🌐 **Live Application**
- **🌍 Live Backend**: [https://vexocore-project.onrender.com](https://vexocore-project.onrender.com)
- **🔌 API Base**: [https://vexocore-project.onrender.com/api](https://vexocore-project.onrender.com/api)
- **🏥 Health Check**: [https://vexocore-project.onrender.com/api/health](https://vexocore-project.onrender.com/api/health)

## ✨ Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure JWT-based authentication
- **Profile Management**: Update personal information and change passwords
- **Account Security**: Password hashing with bcrypt, secure session management

### 📋 Task Management
- **CRUD Operations**: Create, read, update, and delete tasks
- **Priority Levels**: High, Medium, Low priority classification
- **Due Dates**: Set and track task deadlines
- **Status Tracking**: Mark tasks as completed or pending
- **User Association**: Tasks are linked to specific users

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Tailwind CSS**: Beautiful, modern styling with utility-first approach
- **Interactive Components**: Smooth animations and transitions
- **Intuitive Navigation**: Easy-to-use dashboard and task management

### 🧪 Testing & Quality
- **End-to-End Testing**: Playwright for comprehensive UI testing
- **Unit Testing**: Jest for backend logic testing
- **Code Quality**: ESLint and Prettier for consistent code style
- **Git Hooks**: Automated quality checks on commit and push

## 🛠️ Tech Stack

### Frontend
- **React 18.2**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, unopinionated web framework
- **Knex.js**: SQL query builder and ORM
- **PostgreSQL**: Robust, open-source database (hosted on Neon)
- **JWT**: JSON Web Tokens for authentication

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting and style consistency
- **Nodemon**: Automatic server restart during development
- **Concurrently**: Run multiple commands simultaneously

### Testing & CI/CD
- **Playwright**: End-to-end testing framework
- **Jest**: Unit testing framework
- **GitHub Actions**: Automated CI/CD pipeline
- **Simple Git Hooks**: Pre-commit and pre-push quality checks

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js 18+** installed on your system
- **pnpm** package manager (recommended) or npm
- **Git** for version control
- **PostgreSQL database** (we use Neon for hosting)

## 🚀 Getting Started

### 🌐 **Live Demo**
**Your application is already deployed and running!**
- **🔗 Live Backend**: [https://vexocore-project.onrender.com](https://vexocore-project.onrender.com)
- **📱 Test the API**: [https://vexocore-project.onrender.com/api/health](https://vexocore-project.onrender.com/api/health)

### 1. Clone the Repository

```bash
git clone https://github.com/Aviral-Saxenaa/vexocore-project.git
cd vexocore-project
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the project root with your database credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Database Configuration (Neon PostgreSQL)
DB_CLIENT=postgresql
DB_HOST=your-neon-host
DB_PORT=5432
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. Database Setup

Run the database setup script to create tables:

```bash
pnpm run db:setup
```

### 5. Start Development Servers

#### Option A: Run Both Frontend and Backend
```bash
pnpm run dev
```

#### Option B: Run Separately
```bash
# Terminal 1 - Backend
pnpm run dev:backend

# Terminal 2 - Frontend
pnpm run dev:frontend
```

### 6. Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api/health

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Start both frontend and backend in development mode |
| `pnpm run dev:backend` | Start only the backend server with nodemon |
| `pnpm run dev:frontend` | Start only the frontend with Vite |
| `pnpm run build` | Build the frontend for production |
| `pnpm run preview` | Preview the production build locally |
| `pnpm run start` | Start the production backend server |
| `pnpm run test` | Run Playwright end-to-end tests |
| `pnpm run test:unit` | Run Jest unit tests |
| `pnpm run lint` | Run ESLint to check code quality |
| `pnpm run lint:fix` | Fix ESLint issues automatically |
| `pnpm run format` | Format code with Prettier |
| `pnpm run db:setup` | Set up database tables |
| `pnpm run db:migrate` | Run database migrations |
| `pnpm run db:rollback` | Rollback database migrations |

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR DEFAULT 'medium',
  due_date DATE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `DELETE /api/auth/account` - Delete account

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion
- `GET /api/tasks/stats` - Get task statistics

### Health Check
- `GET /api/health` - API health status

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run unit tests only
pnpm run test:unit

# Run tests with coverage
pnpm run test:coverage
```

### Test Structure
- **E2E Tests**: Located in `tests/` directory using Playwright
- **Unit Tests**: Located in `src/__tests__/` using Jest
- **API Tests**: Located in `tests/api/` using Supertest

## 🔧 Code Quality

### Linting
```bash
# Check for linting issues
pnpm run lint

# Fix linting issues automatically
pnpm run lint:fix
```

### Formatting
```bash
# Format code with Prettier
pnpm run format

# Check formatting without changes
pnpm run format:check
```

## 🚀 Deployment

### ✅ **Already Deployed!**
Your VexoCore Task Manager is **live and running** on Render:
- **🌍 Production URL**: [https://vexocore-project.onrender.com](https://vexocore-project.onrender.com)
- **🔌 API Endpoints**: [https://vexocore-project.onrender.com/api](https://vexocore-project.onrender.com/api)
- **🏥 Health Status**: [https://vexocore-project.onrender.com/api/health](https://vexocore-project.onrender.com/api/health)

### Production Build (Local)
```bash
# Build frontend
pnpm run build

# Start production server
pnpm run start
```

### Environment Variables (Already Configured on Render)
- ✅ `NODE_ENV=production`
- ✅ Production database credentials (Neon PostgreSQL)
- ✅ Secure `JWT_SECRET`
- ✅ CORS origins configured

## 📁 Project Structure

```
vexocore-project/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── layout/        # Layout components
│   │   ├── profile/       # Profile components
│   │   └── tasks/         # Task management components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   ├── styles/            # CSS and styling
│   ├── config/            # Configuration files
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   └── index.js           # Main server file
├── public/                 # Static assets
├── tests/                  # Test files
├── scripts/                # Utility scripts
├── .github/                # GitHub Actions workflows
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.mjs       # ESLint configuration
├── playwright.config.js    # Playwright configuration
└── README.md               # This file
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aviral Saxena**
- GitHub: [@Aviral-Saxenaa](https://github.com/Aviral-Saxenaa)
- Project: [VexoCore Task Manager](https://github.com/Aviral-Saxenaa/vexocore-project)

## 🙏 Acknowledgments

- **Neon** for providing the PostgreSQL database hosting
- **Vite** team for the excellent build tool
- **Tailwind CSS** for the beautiful utility-first CSS framework
- **Express.js** community for the robust web framework

## 📞 Support

If you encounter any issues or have questions:

1. **Check** the [Issues](https://github.com/Aviral-Saxenaa/vexocore-project/issues) page
2. **Create** a new issue with detailed information
3. **Contact** the maintainer via GitHub

---

**⭐ Star this repository if you find it helpful!**

**🔄 Keep updated with the latest changes by watching the repository.**