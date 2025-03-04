# SpendSmart - Expense Tracker

## Overview

SpendSmart is a modern, user-friendly expense tracking application built with the MERN stack (MongoDB, Express.js, React, Node.js). It empowers users to manage their expenses and incomes efficiently, expense/income tracking, and a 3D financial overview chart. The app boasts a sleek UI with particle animations, a creative homepage, and secure authentication using JWT and nodemailer for Email-OTP-Verification.

## Key Features

- **User Signup/Login** with email, password, phone number, and OTP verification (using Nodemailer).
- **Track and Categorize** expenses and incomes.
- **Interactive 3D Pie Chart** for financial insights.
- **Responsive Design** powered by Bootstrap.
- **Engaging Particle Animations** for a modern look and feel.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.20.2 or v20.12.1)
- **npm** (Node Package Manager, bundled with Node.js)
- **MongoDB** (preferably MongoDB Atlas for cloud deployment)
- **Git** (for version control and GitHub integration)

## Installation

### Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/Kruthikmanubolu/Expense-Tracker-MERN-Stack.git
cd Expense-Tracker-MERN-Stack
```

## Backend Setup

### Navigate to the backend directory:

```bash
cd backend
```

### Install dependencies:

```bash
npm install
```

### Configure environment variables:

Create a .env file in the backend directory with the following content:

```bash
PORT=5000
MONGO_URI=mongodb+srv://<your-mongo-db-connection-string>
JWT_SECRET=<your-secure-jwt-secret>
EMAIL_USER=<your-gmail-address>
EMAIL_PASS=<your-gmail-app-password>
```

Replace the placeholders with your actual MongoDB Atlas URI, secure JWT secret, Gmail address, and Gmail App Password (see Gmail Setup for OTP in the Usage section).

Run the backend:

For local development:

```bash
node server.js
```

Or, with Nodemon for auto-reloading (install with npm install nodemon):

```bash
npx nodemon server.js
```

## Frontend Setup

### Navigate to the frontend directory:

```bash
cd ../frontend
```

### Install dependencies:

```bash
npm install
```

### Configure environment variables (optional for local testing):

No .env file is required for the frontend, but ensure src/api/api.js points to the correct backend URL:
```bash
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
```

For deployment, update this to your deployed backend URL (e.g., https://expense-track-backend-9rzm.onrender.com/api).

Run the frontend:

For Node.js v20, use:

```bash
set NODE_OPTIONS=--openssl-legacy-provider && npm start
```

For Node.js v16 (recommended), use:

```bash
npm start
```

Open http://localhost:3000 in your browser to see the app.

## Usage

### Signing Up

- Visit http://localhost:3000 to view the creative homepage.
- Click "Sign Up" to access the signup form.
- Enter your username, email (must end with @gmail.com), phone number (e.g., +12345678901), password, and confirm password.
- Submit the form. You’ll receive a 6-digit OTP via email (using Gmail). Verify the OTP on the OTP verification page to complete signup.

### Logging In

- Click "Login" on the homepage or navigate to /layout/login.
- Enter your email and password.
- After successful email/password validation, you’ll receive an OTP via email. Verify it on the OTP verification page to access the dashboard.

### Dashboard

- Track expenses and incomes using the provided forms.
- View a 3D pie chart summarizing your financial overview.
- Edit or delete expenses, add incomes, and log out securely.

### Gmail Setup for OTP

- Enable 2-Factor Authentication (2FA) for your Gmail account if not already enabled.
- Generate an App Password in Google Account Settings > Security > App Passwords for "SpendSmart" (select "Mail" and "Other").
- Use this 16-character App Password as EMAIL_PASS in your .env.

### Deployment

#### Backend Deployment (Render)

Push your backend code to GitHub:

```bash
cd backend
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Sign up or log in to Render.

#### Create a new Web Service:

- Connect your GitHub account and select your repository.
- Set Build Command: npm install.
- Set Start Command: node server.js.

Add environment variables in Render:

```bash
MONGO_URI: Your MongoDB Atlas connection string.
JWT_SECRET: A secure, random string (e.g., e9b7f5c8a2d3e4f6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1).
EMAIL_USER: Your Gmail address.
EMAIL_PASS: Your Gmail App Password.
PORT: 5000 (optional, Render sets it automatically).
```

Deploy. Your backend will be live at a URL like https://expense-track-backend-9rzm.onrender.com.

#### Frontend Deployment (Vercel)

Push your frontend code to GitHub.

For Vercel:

- Create new Project.
- Connect your GitHub repository.
- Import the respective repository.
- Update src/api/api.js to use the deployed backend URL (e.g., https://expense-track-backend-9rzm.onrender.com/api).
- set build commad as npm start and this will give the vercel URL.
  
##### Note - Remove nodemodules folder before connecting to vercel.
