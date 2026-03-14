# FinFlow Platform

A modern, secure digital banking and financial management platform built with a microservices architecture. FinFlow provides users with a seamless experience for managing wallets, performing transactions, and tracking financial activities.

##  Features

- **User Authentication & Profiles**: Secure registration, login, and profile management with JWT tokens
- **Wallet Management**: Create and manage digital wallets with real-time balance tracking
- **Transaction Processing**: Deposit, withdraw, and transfer funds with full audit trails
- **Transaction History**: Comprehensive activity log with filtering and pagination
- **Responsive UI**: Modern React frontend with Tailwind CSS for mobile and desktop
- **Microservices Architecture**: Scalable backend with independent services
- **API Gateway**: Centralized routing and authentication proxy
- **Database Security**: Distributed MongoDB with proper access controls

## Architecture

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

**api-gateway/.env**
```
PORT=5000
JWT_SECRET=your-secret-key
USER_SERVICE_URL=http://localhost:5001
WALLET_SERVICE_URL=http://localhost:5002
TRANSACTION_SERVICE_URL=http://localhost:5003
FRONTEND_URL=http://localhost:5173
```

**user-service/.env**
```
PORT=5001
JWT_SECRET=your-secret-key
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finflow-users
GATEWAY_URL=http://localhost:5000/api
```

**wallet-service/.env**
```
PORT=5002
JWT_SECRET=your-secret-key
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