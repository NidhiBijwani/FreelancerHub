-- ============================================
-- FreelancerHub 2.0
-- Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS freelancerhub;

USE freelancerhub;


-- ============================================
-- 1. USERS
-- ============================================

CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'FREELANCER', 'ADMIN') NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- 2. CUSTOMERS
-- ============================================

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    company_name VARCHAR(150),
    bio TEXT,

    CONSTRAINT fk_customer_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================
-- 3. FREELANCERS
-- ============================================

CREATE TABLE freelancers (
    freelancer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    professional_title VARCHAR(150),
    bio TEXT,
    hourly_rate DECIMAL(10,2) CHECK (hourly_rate >= 0),
    experience_years INT DEFAULT 0 CHECK (experience_years >= 0),
    location VARCHAR(100),
    availability ENUM('AVAILABLE', 'BUSY', 'UNAVAILABLE')
        DEFAULT 'AVAILABLE',

    CONSTRAINT fk_freelancer_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================
-- 4. SKILLS
-- ============================================

CREATE TABLE skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(100) NOT NULL UNIQUE
);


-- ============================================
-- 5. FREELANCER_SKILLS
-- Many-to-Many relationship
-- ============================================

CREATE TABLE freelancer_skills (
    freelancer_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')
        DEFAULT 'BEGINNER',

    PRIMARY KEY (freelancer_id, skill_id),

    CONSTRAINT fk_fs_freelancer
        FOREIGN KEY (freelancer_id)
        REFERENCES freelancers(freelancer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_fs_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(skill_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================
-- 6. PORTFOLIOS
-- ============================================

CREATE TABLE portfolios (
    portfolio_id INT PRIMARY KEY AUTO_INCREMENT,
    freelancer_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    project_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_portfolio_freelancer
        FOREIGN KEY (freelancer_id)
        REFERENCES freelancers(freelancer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================
-- 7. PROJECTS
-- ============================================

CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    budget DECIMAL(12,2) NOT NULL CHECK (budget >= 0),
    deadline DATE,
    status ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
        DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_project_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ============================================
-- 8. PROPOSALS
-- ============================================

CREATE TABLE proposals (
    proposal_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    proposal_text TEXT NOT NULL,
    proposed_amount DECIMAL(12,2) NOT NULL CHECK (proposed_amount >= 0),
    estimated_days INT NOT NULL CHECK (estimated_days > 0),
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')
        DEFAULT 'PENDING',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_proposal_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_proposal_freelancer
        FOREIGN KEY (freelancer_id)
        REFERENCES freelancers(freelancer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT unique_project_freelancer
        UNIQUE (project_id, freelancer_id)
);


-- ============================================
-- 9. CONTRACTS
-- ============================================

CREATE TABLE contracts (
    contract_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL UNIQUE,
    proposal_id INT NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    agreed_amount DECIMAL(12,2) NOT NULL CHECK (agreed_amount >= 0),
    start_date DATE,
    end_date DATE,
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED')
        DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_contract_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_contract_proposal
        FOREIGN KEY (proposal_id)
        REFERENCES proposals(proposal_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_contract_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_contract_freelancer
        FOREIGN KEY (freelancer_id)
        REFERENCES freelancers(freelancer_id)
        ON DELETE CASCADE
);


-- ============================================
-- 10. MESSAGES
-- ============================================

CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_message_sender
        FOREIGN KEY (sender_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_message_receiver
        FOREIGN KEY (receiver_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- ============================================
-- 11. REVIEWS
-- ============================================

CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    project_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(customer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_freelancer
        FOREIGN KEY (freelancer_id)
        REFERENCES freelancers(freelancer_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_review_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,

    CONSTRAINT unique_project_review
        UNIQUE (customer_id, freelancer_id, project_id)
);


-- ============================================
-- 12. NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_projects_customer
ON projects(customer_id);

CREATE INDEX idx_projects_status
ON projects(status);

CREATE INDEX idx_proposals_project
ON proposals(project_id);

CREATE INDEX idx_proposals_freelancer
ON proposals(freelancer_id);

CREATE INDEX idx_messages_receiver
ON messages(receiver_id);

CREATE INDEX idx_notifications_user
ON notifications(user_id);

CREATE INDEX idx_reviews_freelancer
ON reviews(freelancer_id);