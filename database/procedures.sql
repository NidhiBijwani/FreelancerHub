USE freelancerhub;

DELIMITER $$


-- PROCEDURE 1: Get all open projects
CREATE PROCEDURE GetOpenProjects()
BEGIN

    SELECT
        project_id,
        title,
        category,
        budget,
        deadline,
        status
    FROM projects
    WHERE status = 'OPEN'
    ORDER BY deadline;

END$$


-- PROCEDURE 2: Get freelancer rating
CREATE PROCEDURE GetFreelancerRating(
    IN p_freelancer_id INT
)
BEGIN

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

    WHERE f.freelancer_id = p_freelancer_id

    GROUP BY
        f.freelancer_id,
        u.name;

END$$


-- PROCEDURE 3: Get proposals for a project
CREATE PROCEDURE GetProjectProposals(
    IN p_project_id INT
)
BEGIN

    SELECT
        pr.proposal_id,
        p.title AS project_title,
        u.name AS freelancer_name,
        pr.proposed_amount,
        pr.estimated_days,
        pr.status
    FROM proposals pr

    INNER JOIN projects p
        ON pr.project_id = p.project_id

    INNER JOIN freelancers f
        ON pr.freelancer_id = f.freelancer_id

    INNER JOIN users u
        ON f.user_id = u.user_id

    WHERE pr.project_id = p_project_id

    ORDER BY pr.proposed_amount;

END$$


DELIMITER ;
