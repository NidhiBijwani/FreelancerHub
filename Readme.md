# FreelancerHub

FreelancerHub is a full-stack freelancing platform that connects customers with freelancers through project posting, proposal submission, contract management, communication, reviews, and notifications.

## 🚀 Features

### 👤 User Authentication

* Customer and Freelancer registration
* Secure login using JWT authentication
* Password hashing using bcrypt
* Role-based authorization
* Admin authentication

### 🧑‍💼 Customer Module

* Customer dashboard
* Create and manage projects
* View proposals
* Accept freelancer proposals
* Automatically create contracts
* View contracts
* Submit reviews and ratings
* Send and receive messages
* View notifications

### 💻 Freelancer Module

* Freelancer dashboard
* View available projects
* Submit project proposals
* Track proposals
* View contracts
* View reviews and ratings
* Send and receive messages
* View notifications

### 🛠️ Admin Module

* Admin dashboard
* View system statistics
* View all users
* View all projects
* View all proposals

## 🗄️ Database Features

The project demonstrates important DBMS concepts including:

* 12 relational tables
* Primary keys
* Foreign keys
* Unique constraints
* Check constraints
* ENUM constraints
* One-to-one and one-to-many relationships
* INNER JOIN
* LEFT JOIN
* Aggregate functions
* GROUP BY
* HAVING
* Subqueries
* Views
* Stored procedures
* Triggers
* Transactions

### Database Objects

| Object            | Count |
| ----------------- | ----: |
| Tables            |    12 |
| Views             |     4 |
| Triggers          |     1 |
| Stored Procedures |     3 |

## 🛠️ Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MySQL

### Authentication & Security

* JWT
* bcrypt
* Role-Based Access Control

## 📂 Project Structure

```text
FreelancerHub-2.0/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── database/
│   ├── schema.sql
│   ├── queries.sql
│   ├── views.sql
│   ├── triggers.sql
│   └── procedures.sql
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   ├── customer-dashboard.html
│   ├── freelancer-dashboard.html
│   ├── admin-dashboard.html
│   ├── project-proposals.html
│   ├── contracts.html
│   └── communication.html
│
└── Readme.md
```

## 🔄 Main Workflow

```text
Customer
   │
   ▼
Create Project
   │
   ▼
Freelancer Views Project
   │
   ▼
Submit Proposal
   │
   ▼
Customer Reviews Proposal
   │
   ▼
Accept Proposal
   │
   ▼
Contract Created
   │
   ▼
Project In Progress
   │
   ▼
Project Completed
   │
   ▼
Customer Submits Review
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/NidhiBijwani/FreelancerHub.git
cd FreelancerHub
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=freelancerhub
DB_PORT=3306
JWT_SECRET=YOUR_JWT_SECRET
```

### 4. Setup MySQL Database

Create the database:

```sql
CREATE DATABASE freelancerhub;
USE freelancerhub;
```

Then execute the SQL files from the `database` folder.

### 5. Start the Backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 6. Start the Frontend

From the `frontend` directory, use a local development server such as:

```bash
npx http-server
```

Then open the URL provided by the server.

## 🔐 Security

Sensitive information is stored in environment variables.

The following files/data should not be committed:

```text
.env
node_modules/
```

Passwords are securely hashed using bcrypt and authentication is handled using JWT tokens.

## 📌 Project Status

**Completed and tested**

The major application workflows including authentication, project creation, proposal submission, proposal acceptance, contract creation, messaging, notifications, and reviews have been tested successfully.
