USE freelancerhub;


-- VIEW 1: Complete Project Details
CREATE OR REPLACE VIEW vw_project_details AS
SELECT
    p.project_id,
    p.title,
    p.description,
    p.category,
    p.budget,
    p.deadline,
    p.status,
    u.name AS customer_name,
    u.email AS customer_email
FROM projects p
INNER JOIN customers c
    ON p.customer_id = c.customer_id
INNER JOIN users u
    ON c.user_id = u.user_id;


-- VIEW 2: Project Proposal Details
CREATE OR REPLACE VIEW vw_project_proposals AS
SELECT
    p.project_id,
    p.title AS project_title,
    u.name AS freelancer_name,
    u.email AS freelancer_email,
    pr.proposal_id,
    pr.proposed_amount,
    pr.estimated_days,
    pr.status AS proposal_status
FROM projects p
INNER JOIN proposals pr
    ON p.project_id = pr.project_id
INNER JOIN freelancers f
    ON pr.freelancer_id = f.freelancer_id
INNER JOIN users u
    ON f.user_id = u.user_id;


-- VIEW 3: Freelancer Ratings
CREATE OR REPLACE VIEW vw_freelancer_ratings AS
SELECT
    f.freelancer_id,
    u.name AS freelancer_name,
    f.professional_title,
    f.hourly_rate,
    AVG(r.rating) AS average_rating,
    COUNT(r.review_id) AS total_reviews
FROM freelancers f
INNER JOIN users u
    ON f.user_id = u.user_id
LEFT JOIN reviews r
    ON f.freelancer_id = r.freelancer_id
GROUP BY
    f.freelancer_id,
    u.name,
    f.professional_title,
    f.hourly_rate;


-- VIEW 4: Active Contracts
CREATE OR REPLACE VIEW vw_active_contracts AS
SELECT
    c.contract_id,
    p.title AS project_title,
    customer.name AS customer_name,
    freelancer.name AS freelancer_name,
    c.agreed_amount,
    c.start_date,
    c.end_date,
    c.status
FROM contracts c
INNER JOIN projects p
    ON c.project_id = p.project_id
INNER JOIN users customer
    ON c.customer_id = customer.user_id
INNER JOIN users freelancer
    ON c.freelancer_id = freelancer.user_id
WHERE c.status = 'ACTIVE';