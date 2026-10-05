USE freelancerhub;


-- =========================================================
-- 1. BASIC SELECT QUERIES
-- =========================================================

-- Display all users
SELECT *
FROM users;


-- Display only freelancers
SELECT *
FROM users
WHERE role = 'FREELANCER';


-- Display only customers
SELECT *
FROM users
WHERE role = 'CUSTOMER';


-- Display all open projects
SELECT *
FROM projects
WHERE status = 'OPEN';



-- =========================================================
-- 2. INNER JOIN
-- =========================================================

-- Display projects with customer names

SELECT
    p.project_id,
    p.title,
    p.category,
    p.budget,
    p.status,
    u.name AS customer_name
FROM projects p
INNER JOIN customers c
    ON p.customer_id = c.customer_id
INNER JOIN users u
    ON c.user_id = u.user_id;


-- =========================================================
-- 3. JOIN PROJECTS AND PROPOSALS
-- =========================================================

SELECT
    p.project_id,
    p.title AS project_title,
    pr.proposal_id,
    pr.proposed_amount,
    pr.estimated_days,
    pr.status
FROM projects p
INNER JOIN proposals pr
    ON p.project_id = pr.project_id;


-- =========================================================
-- 4. PROPOSALS WITH FREELANCER DETAILS
-- =========================================================

SELECT
    pr.proposal_id,
    p.title AS project_title,
    u.name AS freelancer_name,
    u.email AS freelancer_email,
    pr.proposed_amount,
    pr.estimated_days,
    pr.status
FROM proposals pr
INNER JOIN freelancers f
    ON pr.freelancer_id = f.freelancer_id
INNER JOIN users u
    ON f.user_id = u.user_id
INNER JOIN projects p
    ON pr.project_id = p.project_id;


-- =========================================================
-- 5. COMPLETE PROJECT-PROPOSAL-CUSTOMER REPORT
-- =========================================================

SELECT
    p.project_id,
    p.title AS project_title,
    customer.name AS customer_name,
    freelancer.name AS freelancer_name,
    pr.proposed_amount,
    pr.status AS proposal_status
FROM projects p

INNER JOIN customers c
    ON p.customer_id = c.customer_id

INNER JOIN users customer
    ON c.user_id = customer.user_id

INNER JOIN proposals pr
    ON p.project_id = pr.project_id

INNER JOIN freelancers f
    ON pr.freelancer_id = f.freelancer_id

INNER JOIN users freelancer
    ON f.user_id = freelancer.user_id;



-- =========================================================
-- 6. AGGREGATE FUNCTIONS
-- =========================================================

-- Total number of users

SELECT
    COUNT(*) AS total_users
FROM users;


-- Total customers

SELECT
    COUNT(*) AS total_customers
FROM customers;


-- Total freelancers

SELECT
    COUNT(*) AS total_freelancers
FROM freelancers;


-- Average project budget

SELECT
    AVG(budget) AS average_project_budget
FROM projects;


-- Maximum project budget

SELECT
    MAX(budget) AS highest_project_budget
FROM projects;


-- Minimum project budget

SELECT
    MIN(budget) AS lowest_project_budget
FROM projects;


-- Total project budget

SELECT
    SUM(budget) AS total_project_budget
FROM projects;



-- =========================================================
-- 7. GROUP BY
-- =========================================================

-- Number of projects by status

SELECT
    status,
    COUNT(*) AS total_projects
FROM projects
GROUP BY status;


-- Number of users by role

SELECT
    role,
    COUNT(*) AS total_users
FROM users
GROUP BY role;


-- Number of proposals by status

SELECT
    status,
    COUNT(*) AS total_proposals
FROM proposals
GROUP BY status;


-- Average project budget by category

SELECT
    category,
    AVG(budget) AS average_budget
FROM projects
GROUP BY category;



-- =========================================================
-- 8. HAVING
-- =========================================================

-- Categories having average budget greater than 10000

SELECT
    category,
    AVG(budget) AS average_budget
FROM projects
GROUP BY category
HAVING AVG(budget) > 10000;


-- Proposal statuses having more than one proposal

SELECT
    status,
    COUNT(*) AS proposal_count
FROM proposals
GROUP BY status
HAVING COUNT(*) > 1;



-- =========================================================
-- 9. SUBQUERY
-- =========================================================

-- Projects whose budget is greater than
-- the average project budget

SELECT
    project_id,
    title,
    budget
FROM projects
WHERE budget >
(
    SELECT AVG(budget)
    FROM projects
);



-- =========================================================
-- 10. SUBQUERY WITH MAXIMUM
-- =========================================================

-- Project having the highest budget

SELECT
    project_id,
    title,
    budget
FROM projects
WHERE budget =
(
    SELECT MAX(budget)
    FROM projects
);



-- =========================================================
-- 11. FREELANCERS WHO HAVE SUBMITTED PROPOSALS
-- =========================================================

SELECT
    user_id,
    name,
    email
FROM users
WHERE user_id IN
(
    SELECT f.user_id
    FROM freelancers f
    INNER JOIN proposals p
        ON f.freelancer_id = p.freelancer_id
);



-- =========================================================
-- 12. PROJECTS HAVING AT LEAST ONE PROPOSAL
-- =========================================================

SELECT
    project_id,
    title,
    budget
FROM projects
WHERE project_id IN
(
    SELECT project_id
    FROM proposals
);



-- =========================================================
-- 13. PROJECTS WITHOUT PROPOSALS
-- =========================================================

SELECT
    project_id,
    title,
    budget
FROM projects
WHERE project_id NOT IN
(
    SELECT project_id
    FROM proposals
);



-- =========================================================
-- 14. CORRELATED SUBQUERY
-- =========================================================

-- Find freelancers whose hourly rate is greater
-- than the average hourly rate

SELECT
    f.freelancer_id,
    u.name,
    f.hourly_rate
FROM freelancers f

INNER JOIN users u
    ON f.user_id = u.user_id

WHERE f.hourly_rate >
(
    SELECT AVG(f2.hourly_rate)
    FROM freelancers f2
);



-- =========================================================
-- 15. LEFT JOIN
-- =========================================================

-- Display all projects, including projects
-- that have no proposals

SELECT
    p.project_id,
    p.title,
    p.budget,
    pr.proposal_id
FROM projects p
LEFT JOIN proposals pr
    ON p.project_id = pr.project_id;



-- =========================================================
-- 16. FREELANCER PROPOSAL COUNT
-- =========================================================

SELECT
    f.freelancer_id,
    u.name AS freelancer_name,
    COUNT(pr.proposal_id) AS total_proposals
FROM freelancers f

INNER JOIN users u
    ON f.user_id = u.user_id

LEFT JOIN proposals pr
    ON f.freelancer_id = pr.freelancer_id

GROUP BY
    f.freelancer_id,
    u.name;



-- =========================================================
-- 17. FREELANCERS WITH MORE THAN ONE PROPOSAL
-- =========================================================

SELECT
    f.freelancer_id,
    u.name AS freelancer_name,
    COUNT(pr.proposal_id) AS total_proposals
FROM freelancers f

INNER JOIN users u
    ON f.user_id = u.user_id

INNER JOIN proposals pr
    ON f.freelancer_id = pr.freelancer_id

GROUP BY
    f.freelancer_id,
    u.name

HAVING COUNT(pr.proposal_id) > 1;



-- =========================================================
-- 18. CONTRACT REPORT
-- =========================================================

SELECT
    c.contract_id,
    p.title AS project_title,
    customer.name AS customer_name,
    freelancer.name AS freelancer_name,
    c.agreed_amount,
    c.status
FROM contracts c

INNER JOIN projects p
    ON c.project_id = p.project_id

INNER JOIN customers cu
    ON c.customer_id = cu.customer_id

INNER JOIN users customer
    ON cu.user_id = customer.user_id

INNER JOIN freelancers fr
    ON c.freelancer_id = fr.freelancer_id

INNER JOIN users freelancer
    ON fr.user_id = freelancer.user_id;



-- =========================================================
-- 19. REVIEW REPORT
-- =========================================================

SELECT
    r.review_id,
    customer.name AS customer_name,
    freelancer.name AS freelancer_name,
    p.title AS project_title,
    r.rating,
    r.comment
FROM reviews r

INNER JOIN customers c
    ON r.customer_id = c.customer_id

INNER JOIN users customer
    ON c.user_id = customer.user_id

INNER JOIN freelancers f
    ON r.freelancer_id = f.freelancer_id

INNER JOIN users freelancer
    ON f.user_id = freelancer.user_id

INNER JOIN projects p
    ON r.project_id = p.project_id;



-- =========================================================
-- 20. FREELANCER AVERAGE RATINGS
-- =========================================================

SELECT
    f.freelancer_id,
    u.name AS freelancer_name,
    AVG(r.rating) AS average_rating,
    COUNT(r.review_id) AS total_reviews
FROM freelancers f

INNER JOIN users u
    ON f.user_id = u.user_id

LEFT JOIN reviews r
    ON f.freelancer_id = r.freelancer_id

GROUP BY
    f.freelancer_id,
    u.name;