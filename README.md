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
