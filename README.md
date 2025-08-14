# ⚙️ NestJS Config Service

> Provides server-side and client-side support for external configuration in a distributed system. With Config Server, you have a centralized location to manage external application properties across all environments.

![NestJS](https://img.shields.io/badge/Nest.js-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

## 🔌 API Server Endpoints

| Method | Endpoint                 | Description                                   |
|--------|--------------------------|-----------------------------------------------|
| `GET`  | `/environments`          | Retrieve a list of all environments           |
| `GET`  | `/:environment/services` | Retrieve all services in a given environment  |
| `GET`  | `/:environment/:service` | Retrieve configuration for a specific service |