# FinFlow | Microservices Financial Platform

A robust, scalable digital banking application built with a **Microservices Architecture**.

## System Architecture
The system is designed with a **Single Entry Point (API Gateway)** pattern to abstract service complexity from the frontend.



### Components:
* **Frontend**: React (Vite) + Tailwind CSS.
* **API Gateway**: Centralized entry point handling CORS and request routing.
* **User Service**: Handles Authentication (JWT), Authorization, and Profile management.
* **Wallet Service**: Manages financial transactions, balances, and ledger integrity.
* **Database**: Distributed MongoDB Atlas clusters.

## Tech Stack & Principles
* **Architecture**: Microservices, API Gateway, Proxy Pattern.
* **Security**: JWT Authentication, RBAC (Role-Based Access Control), Password Hashing (Bcrypt).
* **DevOps**: Environment-based configuration, Docker-ready, Monorepo structure.
* **API**: RESTful principles with centralized error handling.

## Deployment Guide
1. **Backends**: Deploy `user-service`, `wallet-service`, and `api-gateway` as Web Services on Render.
2. **Database**: Configure MongoDB Atlas Network Access to allow Render IP addresses.
3. **Environment Variables**:
   - Set `USER_SERVICE_URL` and `WALLET_SERVICE_URL` in the Gateway.
   - Set `VITE_GATEWAY_URL` in the Frontend.