# 🚀 Microservices Architecture

A production-ready microservices demonstration project showcasing synchronous inter-service communication using **GraphQL** and **REST APIs**, orchestrated in a **Kubernetes cluster** with Docker containerization.

---

## 📋 Overview

This project demonstrates a modern microservices architecture with three independent services communicating synchronously:

- **Bank Service** (GraphQL API) - Frontend-facing API gateway
- **Accounts Service** (REST API) - Account management microservice  
- **Profile Service** (REST API) - User profile management microservice
- **Auth Service** (In Progress) - JWT-based authentication microservice

Each service is independently containerized and deployable to Kubernetes with horizontal pod autoscaling capabilities.

---

## ✨ Key Features

### Architecture Patterns
- ✅ **Synchronous Inter-Service Communication** - Services communicate in real-time via HTTP
- ✅ **GraphQL Federation** - Apollo Server with schema composition and code generation
- ✅ **REST APIs** - Express-based microservices with TypeScript
- ✅ **Type Safety** - Full TypeScript implementation with code generation for GraphQL types

### DevOps & Deployment
- ✅ **Docker Containerization** - All services packaged as Docker images
- ✅ **Docker Compose** - Local development environment setup
- ✅ **Kubernetes Ready** - Complete k8s manifests including:
  - Service deployments
  - Service discovery
  - Horizontal Pod Autoscaling (HPA)
  - NGINX Ingress configuration
- ✅ **Container Orchestration** - Production-grade cluster entry with NGINX Ingress

### Development Experience
- ✅ **Code Generation** - Automatic TypeScript types from GraphQL schema
- ✅ **Modular Schema** - Separate schema files stitched together
- ✅ **HTTP Client Integration** - Axios for internal service communication

---

## 🏗️ Project Structure

```
microservices/
├── bank/                    # GraphQL API Gateway (Apollo Server)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── accounts/                # REST API (Express + TypeScript)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── profile/                 # REST API (Express + TypeScript)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── auth/                    # Authentication Service (In Progress)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── k8s/                     # Kubernetes manifests
│   ├── deployments/
│   ├── services/
│   └── hpa/
├── docker-compose.yml       # Local development environment
├── README.md               # This file
├── TESTING.md              # Comprehensive testing guide
└── .env.example            # Environment configuration template
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js |
| **Language** | TypeScript, JavaScript |
| **GraphQL** | Apollo Server, GraphQL Code Generator |
| **REST Framework** | Express.js |
| **HTTP Client** | Axios |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes, NGINX Ingress |
| **Scaling** | Horizontal Pod Autoscaling (HPA) |

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 16+ (for local development)
- kubectl (for Kubernetes deployment)
- A Kubernetes cluster (for production deployment)

### Local Development with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/surojcodes/microservices.git
   cd microservices
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start services**
   ```bash
   docker-compose up --build
   ```

4. **Access the services**
   - Bank GraphQL API: `http://localhost:4001/graphql`
   - Accounts REST API: `http://localhost:3001`
   - Profile REST API: `http://localhost:3002`

### Kubernetes Deployment

1. **Build and push Docker images**
   ```bash
   docker build -t yourusername/bank:latest ./bank
   docker build -t yourusername/accounts:latest ./accounts
   docker build -t yourusername/profile:latest ./profile
   docker push yourusername/bank:latest
   docker push yourusername/accounts:latest
   docker push yourusername/profile:latest
   ```

2. **Deploy to cluster**
   ```bash
   kubectl apply -f k8s/
   ```

3. **Verify deployment**
   ```bash
   kubectl get deployments
   kubectl get services
   kubectl get hpa
   ```

---

## 📡 Service Communication

### Architecture Diagram

```
┌─────────────────────────────────────┐
│    NGINX Ingress (Cluster Entry)    │
└──────────────┬──────────────────────┘
               │
      ┌────────▼─────────┐
      │   Bank Service   │
      │  (GraphQL API)   │
      └────────┬─────────┘
               │
      ┌────────┴─────────┬─────────────┐
      │                  │             │
   ┌──▼──────┐    ┌─────▼──┐    ┌────▼──────┐
   │ Accounts │    │ Profile │    │   Auth    │
   │ (REST)   │    │ (REST)  │    │ (REST)    │
   └──────────┘    └─────────┘    └───────────┘
```

### Service Details

**Bank Service (GraphQL)**
- Port: 4001
- Purpose: Frontend-facing API gateway
- Features:
  - Apollo Server with code generation
  - Schema composition from multiple services
  - Synchronous calls to Accounts and Profile services
  - Service discovery via Kubernetes DNS

**Accounts Service (REST)**
- Port: 3001
- Purpose: Account management
- Features: Standalone Express server with TypeScript

**Profile Service (REST)**
- Port: 3002
- Purpose: User profile management
- Features: Standalone Express server with TypeScript

**Auth Service (REST)**
- Port: 3003
- Purpose: Authentication & Authorization (In Progress)
- Planned: JWT tokens, refresh token flow, optional JWE/Identity Provider

---

## 🔐 Security & Scalability

### Horizontal Pod Autoscaling
Each service includes HPA configuration for automatic scaling based on CPU/memory metrics:
- Minimum replicas: 2
- Maximum replicas: 10 (configurable)
- Target CPU utilization: 70%

### Load Balancing
- NGINX Ingress handles external traffic distribution
- Kubernetes Service DNS for internal load balancing

---

## 📝 Testing

Comprehensive testing guides are available:
- **[TESTING.md](./TESTING.md)** - Detailed testing procedures and examples
- **[TESTING_SUMMARY.md](./TESTING_SUMMARY.md)** - Quick reference and summary

See these files for:
- GraphQL query examples
- REST API endpoints
- Integration testing procedures
- Curl commands for manual testing

---

## 🔄 Development Workflow

1. **Local Development**: Use `docker-compose up` for isolated service testing
2. **Testing**: Follow the comprehensive guides in TESTING.md
3. **Deployment**: Push to Kubernetes cluster via manifests in `k8s/` directory
4. **Monitoring**: Check HPA and pod metrics with kubectl

---

## 📚 Environment Configuration

Configure services using the `.env` file:

```env
# Example configuration
ACCOUNTS_SERVICE_URL=http://accounts:3001
PROFILE_SERVICE_URL=http://profile:3002
AUTH_SERVICE_URL=http://auth:3003
PORT=4001
NODE_ENV=development
```

See `.env.example` for all available options.

---

## 🎯 Roadmap

- [x] Bank Service (GraphQL API Gateway)
- [x] Accounts Service (REST API)
- [x] Profile Service (REST API)
- [x] Docker Compose setup
- [x] Kubernetes manifests
- [x] HPA configuration
- [ ] Auth Service (JWT Tokens)
- [ ] Refresh token implementation
- [ ] JWE encryption support
- [ ] Identity Provider integration
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Distributed tracing
- [ ] Centralized logging

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📄 License

This project is open source and available under the MIT License.

---

## 📞 Support

For questions or issues, please open a GitHub issue or contact the maintainer.

---

**Happy coding!** 🎉
