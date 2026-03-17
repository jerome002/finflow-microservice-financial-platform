# FinFlow Platform

FinFlow is a modern digital banking and financial management platform built using a microservices architecture. The system is designed to simulate real-world financial applications by providing secure, scalable, and modular services for managing user accounts, wallets, and financial transactions.

The backend is structured into independent services, including a User Service for authentication and profile management, a Wallet Service for balance management and fund transfers, and a Transaction Service for logging and tracking financial activities. An API Gateway acts as a centralized entry point, handling request routing, authentication, and communication between services.

The platform implements secure authentication using JWT and bcrypt, ensuring safe handling of user credentials and protected access to resources. Users can perform deposits, withdrawals, and peer-to-peer transfers, with all actions recorded in a transaction history system that supports filtering and pagination.

The frontend is built with React and Tailwind CSS, providing a responsive and user-friendly interface for interacting with the system. The application is deployed in a cloud environment with environment-based configurations, and structured to support containerization with Docker and automated workflows using CI/CD pipelines.

FinFlow demonstrates key backend engineering concepts including microservices architecture, API Gateway design, service isolation, and scalable system design, making it a strong representation of production-oriented fullstack development.

##  Features

- **User Authentication & Profiles**: Secure registration, login, email verification, and password reset with JWT tokens
- **Wallet Management**: Create and manage digital wallets with real-time balance tracking
- **Transaction Processing**: Deposit, withdraw, and transfer funds with full audit trails and email notifications
- **Transaction History**: Comprehensive activity log with filtering and pagination
- **Email Notifications**: Automated email alerts for all financial transactions
- **Responsive UI**: Modern React frontend with Tailwind CSS for mobile and desktop
- **Microservices Architecture**: Scalable backend with independent services
- **API Gateway**: Centralized routing and authentication proxy
- **Database Security**: Distributed MongoDB with proper access controls

## Live Demo

Experience FinFlow in action! The application is deployed on Render with the following services:

- **Frontend**: [https://finflow-frontend-j8xm.onrender.com](https://finflow-frontend-j8xm.onrender.com)
- **API Gateway**: [https://finflow-api-gateway.onrender.com](https://finflow-api-gateway.onrender.com)
- **User Service**: [https://finflow-user-service.onrender.com](https://finflow-user-service.onrender.com)
- **Wallet Service**: [https://finflow-wallet-service.onrender.com](https://finflow-wallet-service.onrender.com)
- **Transaction Service**: [https://finflow-transaction-service.onrender.com](https://finflow-transaction-service.onrender.com)

### Try It Out
1. Visit the [Frontend URL](https://finflow-frontend-j8xm.onrender.com)
2. Register a new account
3. Create a wallet and perform transactions
4. View your transaction history


## Architecture Decisions

- Microservices used for scalability and service isolation
- API Gateway centralizes authentication and routing
- Separate databases per service for loose coupling

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   API Gateway   │
│   (React/Vite)  │    │   (Express)     │
└─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼─────┐
        │ User Service │ │Wallet Service│ │Transaction │
        │  (Auth)      │ │ (Finances)   │ │  Service   │
        └──────────────┘ └──────────────┘ └───────────┘
                │               │               │
        ┌───────▼───────────────▼───────────────▼──────┐
        │               MongoDB Atlas                   │
        └──────────────────────────────────────────────┘
```

### Services

- **API Gateway** (Port 5000): Routes requests, handles authentication, CORS
- **User Service** (Port 5001): User registration, login, profiles
- **Wallet Service** (Port 5002): Balance management, deposits, withdrawals, transfers
- **Transaction Service** (Port 5003): Transaction logging and history

##  Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Winston** for logging
- **CORS** for cross-origin requests

### DevOps
- **Environment Variables** for configuration
- **Docker-ready** structure
- **Monorepo** with service separation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd finflow-platform
```

### 2. Backend Setup

#### Start Services Individually
```bash
# Terminal 1: API Gateway
cd services/api-gateway
npm install
npm start

# Terminal 2: User Service
cd services/user-service
npm install
npm start

# Terminal 3: Wallet Service
cd services/wallet-service
npm install
npm start

# Terminal 4: Transaction Service
cd services/transaction-service
npm install
npm start
```

#### Environment Variables
Create `.env` files in each service directory with:

**For Local Development:**
```
# Local .env files use localhost URLs as shown above
```

**For Production Deployment (Render):**
- **API Gateway**:
  - `USER_SERVICE_URL=https://finflow-user-service.onrender.com`
  - `WALLET_SERVICE_URL=https://finflow-wallet-service.onrender.com`
  - `TRANSACTION_SERVICE_URL=https://finflow-transaction-service.onrender.com`
  - `FRONTEND_URL=https://finflow-frontend-j8xm.onrender.com`

- **Frontend**:
  - `VITE_GATEWAY_URL=https://finflow-api-gateway.onrender.com/api`

**api-gateway/.env** (Local)
```
PORT=5000
JWT_SECRET=your-secret-key
USER_SERVICE_URL=http://localhost:5001
WALLET_SERVICE_URL=http://localhost:5002
TRANSACTION_SERVICE_URL=http://localhost:5003
FRONTEND_URL=http://localhost:5173
```

**user-service/.env** (Local)
```
PORT=5001
JWT_SECRET=your-secret-key
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow-users
GATEWAY_URL=http://localhost:5000/api
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

**wallet-service/.env**
```
PORT=5002
JWT_SECRET=your-secret-key
USER_SERVICE_URL=http://localhost:5001
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow-wallet
GATEWAY_URL=http://localhost:5000/api
TRANSACTION_SERVICE_URL=http://localhost:5003
```

**transaction-service/.env**
```
PORT=5003
JWT_SECRET=your-secret-key
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow-transaction
GATEWAY_URL=http://localhost:5000/api
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd finflow-frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Register**: Create a new account
2. **Login**: Authenticate with email/password
3. **Create Wallet**: Initialize your digital wallet
4. **Deposit/Withdraw**: Add or remove funds
5. **Transfer**: Send money to other users
6. **View Activity**: Check transaction history

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify/:token` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/profile` - Get user profile

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/create` - Create wallet
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `POST /api/wallet/transfer` - Transfer funds

### Transactions
- `GET /api/transactions` - Get transaction history
- `GET /api/transactions?type=DEPOSIT` - Filter by type
- `GET /api/transactions?page=1&limit=10` - Pagination

## Testing

### Manual Testing
1. Register a new user
2. Login and create a wallet
3. Perform deposit/withdraw/transfer operations
4. Check transaction history
5. Test authentication flows

### API Testing
Use tools like Postman or curl to test endpoints:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or issues:
- Create an issue in the repository
- Check the logs in each service for debugging
- Ensure all environment variables are set correctly

---

Built using Microservices Architecture