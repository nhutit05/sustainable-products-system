# 🌱 ReGreen

> AI-powered sustainable e-commerce platform built with **Spring Boot**, **React**, and **Google Gemini**.

<p align="center">

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green)
![React](https://img.shields.io/badge/React-19-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

## 📖 Overview

ReGreen is a full-stack e-commerce platform promoting sustainable consumption through intelligent shopping experiences and AI-powered assistance.

Unlike a traditional online shopping system, ReGreen combines modern e-commerce capabilities with Retrieval-Augmented Generation (RAG), allowing customers to receive reliable, citation-based answers about sustainable products and environmental topics.

The project was developed as a university capstone by a two-member team, following modern software engineering practices and a layered architecture.

---

## ✨ Highlights

- 🛒 Complete e-commerce workflow
- 🤖 AI chatbot powered by Google Gemini
- 📚 Retrieval-Augmented Generation (RAG)
- 🔍 Semantic search using pgvector
- 💳 PayOS QR payment integration
- 🔐 JWT Authentication & Role-based Authorization
- ☁️ Cloudinary image management
- 📄 Knowledge management for chatbot
- 📦 Dockerized backend services
- 📱 Responsive user interface

---

# 🏗 System Architecture

```
                    React + TypeScript
                             │
                  React Router + Context API
                             │
──────────────────────────────────────────────────
               Spring Boot REST API
──────────────────────────────────────────────────
 Authentication │ Orders │ Products │ AI │ Payment
──────────────────────────────────────────────────
 Spring Security │ JPA │ Hibernate │ Scheduler
──────────────────────────────────────────────────
 PostgreSQL │ Cloudinary │ Supabase │ pgvector
──────────────────────────────────────────────────
        Google Gemini 2.5 Flash
```

---

# 🚀 Core Features

## User Features

- Browse sustainable products
- Product search and filtering
- Shopping cart
- Voucher support
- Checkout
- Online payment
- Order history
- AI chatbot assistance

---

## Administration

- Product management

- Category management

- Voucher management

- Refund processing

- User management

- Report dashboard

- Payout management

- AI knowledge management

---

# 🤖 AI Chatbot

One of the key features of ReGreen is an intelligent chatbot built using **Retrieval-Augmented Generation (RAG)**.

Instead of relying solely on an LLM, uploaded knowledge documents are transformed into searchable vector embeddings, allowing the chatbot to answer user questions using verified project knowledge.

Pipeline:

```
PDF / DOCX

↓

Text Extraction

↓

Chunking

↓

Embedding Generation

↓

pgvector Storage

↓

Semantic Search

↓

Context Retrieval

↓

Google Gemini 2.5 Flash

↓

Citation-based Response
```

Key capabilities

- Semantic search
- Citation support
- Short-term conversation memory
- Knowledge management dashboard

---

# 💳 Payment Workflow

ReGreen integrates **PayOS** for online payment.

```
Checkout

↓

Generate QR Code

↓

Customer Payment

↓

PayOS Webhook

↓

Payment Verification

↓

Order Updated

↓

Scheduler handles timeout
```

The payment workflow automatically synchronizes payment status and cancels expired unpaid orders through scheduled background jobs.

---

# 🛠 Technology Stack

## Backend

- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT

## Frontend

- React
- TypeScript
- Ant Design
- Context API

## Database

- PostgreSQL
- pgvector

## AI

- Spring AI
- Google Gemini 2.5 Flash

## Storage

- Cloudinary
- Supabase Storage

## DevOps

- Docker
- Git
- Maven

---

# 📊 Project Scale

- 👥 Team size: **2**
- 💻 Backend contribution: **65%**
- 🎨 Frontend contribution: **45%**
- 🔗 **50+ REST APIs**
- 🗄️ Approximately **40 database tables**

---

# 📂 Project Structure

```
backend/

 controller/

 service/

 repository/

 entity/

 dto/

 security/

 integration/

frontend/

 pages/

 components/

 services/

 hooks/

 context/

 layouts/
```

---

# 🚀 Getting Started

### Backend

```bash
mvn spring-boot:run
```

### Frontend

```bash
npm install

npm run dev
```

---

# 📸 Screenshots

> Add screenshots of:

- Home page
- Product page
- Checkout
- Admin Dashboard
- AI Chatbot
- Knowledge Management
- Reports

---

# 📌 Roadmap

- [x] Authentication
- [x] Product Management
- [x] Order Management
- [x] Voucher
- [x] Refund
- [x] Reports
- [x] PayOS
- [x] AI Chatbot
- [x] RAG
- [ ] Deployment

---

# 👨‍💻 Team

| Member | Responsibility |
|---------|----------------|
| Vo Minh Nhut | Backend, Frontend, AI Chatbot, Payment Integration |
| Tran Thi Thuy Hien | Frontend & Backend |

---

# 📄 License

This project was developed for educational purposes.
