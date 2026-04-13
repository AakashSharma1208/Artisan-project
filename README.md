<<<<<<< HEAD
# Artisan – Handmade Marketplace

Artisan is a full-stack web application designed to connect talented artisans with customers through a modern and user-friendly digital platform. The application enables users to explore, purchase, and sell handmade products while providing a seamless and secure experience across all functionalities.

The platform focuses on promoting creativity, supporting small businesses, and delivering a professional e-commerce experience tailored specifically for handmade goods.

---

## Project Features

The Artisan platform includes a wide range of features that enhance usability, functionality, and user experience:

* User authentication using email and Google login
* Vendor registration and profile management system
* Product listing and management for vendors
* Category-based browsing for easy product discovery
* Add to cart and checkout functionality
* Contact system with email integration for support
* AI-powered assistant for user interaction
* Admin dashboard for managing users, products, vendors, and orders

---

## Technology Stack

The project is built using modern technologies to ensure performance, scalability, and maintainability.

Frontend:

* React (Vite)
* Tailwind CSS

Backend:

* Node.js
* Express.js

Database:

* MongoDB

Integrations:

* Google OAuth for authentication
* Nodemailer for email services

---

## Project Structure

The application is organized into separate directories for better scalability and maintainability:

* frontend-react
  Contains the React-based user interface

* backend
  Contains the Node.js and Express server along with APIs

* database
  Managed using MongoDB for storing application data

---

## Setup Instructions

Follow the steps below to run the project locally:

1. Clone the repository

2. Navigate to the project directory

3. Install dependencies for both frontend and backend

   For backend:
   npm install

   For frontend:
   npm install

4. Configure environment variables in a .env file (see below)

5. Start the backend server:
   npm start

6. Start the frontend:
   npm run dev

7. Open the application in your browser

---

## Environment Variables

The following environment variables are required for proper functioning of the application:

* MONGO_URI
  MongoDB connection string

* GOOGLE_CLIENT_ID
  Google OAuth client ID

* GOOGLE_CLIENT_SECRET
  Google OAuth client secret

* EMAIL
  Gmail address used for sending emails

* APP_PASSWORD
  Gmail app password for Nodemailer

* JWT_SECRET
  Secret key for authentication tokens

---

## Deployment

The application can be deployed using various platforms:

* Railway for full-stack deployment
* Netlify for frontend and Render for backend
* MongoDB Atlas for cloud database hosting

Ensure that all environment variables are properly configured in the deployment environment.

---

## Screenshots

Add screenshots of the application here to showcase functionality and UI:

* Home Page
* Product Listing Page
* Product Detail Page
* Vendor Dashboard
* Contact Page

---

## Team Members

This project is developed by a team of three members.

Add the following details:

* Name
* Role (Frontend Developer, Backend Developer, AI Engineer, etc.)
* College: K.C. College of Engineering & Management Studies & Research

---

## Project Purpose

The goal of Artisan is to create a reliable and user-friendly platform that empowers artisans to showcase their handmade products while providing customers with a smooth and enjoyable shopping experience. The platform bridges the gap between creativity and commerce by leveraging modern web technologies and intelligent features.

---

## Conclusion

Artisan represents a complete full-stack application that integrates authentication, e-commerce functionality, AI interaction, and real-time communication. It demonstrates practical implementation of modern web development concepts and serves as a strong foundation for building scalable marketplace solutions.
=======
# Artisan – Handmade Marketplace 🎨✨

[![React](https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Artisan is a premium, full-stack handmade marketplace designed to bridge the gap between local creators and conscious consumers. Our platform provides a seamless, vibrant environment for artisans to showcase their heritage and contemporary crafts while offering shoppers a curated, secure, and AI-enhanced shopping experience.

---

## 🌟 Features

### 🔐 Multi-Channel Authentication
- **Secure Access**: Reliable email/password authentication.
- **Google OAuth**: One-click social login integration for an frictionless user journey.

### 🏪 Artisan Ecosystem
- **Vendor Portal**: Specialized onboarding and dashboard for creators to manage their digital storefront.
- **Product Management**: Intuitive tools for artisans to list, describe, and price their unique creations.
- **Category Browsing**: Dynamic product discovery through intelligently organized artisan categories.

### 🛒 Seamless Commerce
- **Dynamic Shopping Cart**: Real-time cart management with persisting state.
- **Integrated Checkout**: Streamlined payment flow and order confirmation.

### 🤖 Intelligence & Communication
- **AI Assistant Integration**: Context-aware AI to help users navigate and explore the marketplace.
- **Contact Us System**: Professional email integration using Nodemailer for direct admin support.

### 🛠️ Admin Powerhouse
- Full administrative control over users, vendor approvals, product moderation, and order fulfillment tracking.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JWT, Google OAuth 2.0 |
| **Communication** | Nodemailer (Gmail SMTP) |

---

## 📁 Project Structure

```text
Artisan/
├── frontend-react/     # React + Vite application (UI/UX)
├── backend/            # Node.js + Express server (REST API)
└── README.md           # Documentation
```

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/artisan-marketplace.git
cd artisan-marketplace
```

### 2. Configure Backend
Navigate to the `backend` folder and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
EMAIL_USER=your_admin_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Configure Frontend
Navigate to the `frontend-react` folder and install dependencies:
```bash
cd ../frontend-react
npm install
```
Create a `.env` file in the `frontend-react` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_id
```

### 4. Run the Application
Start the backend (from `backend` folder):
```bash
npm run dev
```
Start the frontend (from `frontend-react` folder):
```bash
npm run dev
```

---

## 🛠️ Environment Variables Explained

| Variable | Purpose |
| :--- | :--- |
| `MONGODB_URI` | Connection string for your MongoDB Atlas or local instance. |
| `JWT_SECRET` | Secure string used to sign user authentication tokens. |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console. |
| `EMAIL_USER` | The Gmail address used to send "Contact Us" notifications. |
| `EMAIL_PASS` | A 16-character **App Password** generated from your Google Account settings. |

---

## 📸 Screenshots

> [!TIP]
> Add your stunning UI screenshots here to increase project visibility!

| Home Page | Product Detail |
| :---: | :---: |
| ![Home Placeholder](https://via.placeholder.com/400x250?text=Artisan+Home+Page) | ![Product Placeholder](https://via.placeholder.com/400x250?text=Product+Details) |

| Vendor Dashboard | Contact Page |
| :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/400x250?text=Vendor+Dashboard) | ![Contact Placeholder](https://via.placeholder.com/400x250?text=Contact+Email+System) |

---

## 🚢 Deployment

This project is built for modern deployment workflows:
- **Backend**: Can be hosted on [Railway](https://railway.app/), [Render](https://render.com/), or [Heroku](https://www.heroku.com/).
- **Frontend**: Best suited for [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a managed production database.

---

## 👥 Authors & Team

- **Aakash Sharma** - *Lead Developer / Architect*
- **[Name]** - *Frontend Designer*
- **[Name]** - *Backend Engineer*

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
>>>>>>> a54a2aa (final update: dynamic stats + UI improvements)
