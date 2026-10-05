USE freelancerhub;

DELIMITER $$

CREATE TRIGGER after_proposal_accept
AFTER UPDATE ON proposals
FOR EACH ROW
BEGIN

    IF NEW.status = 'ACCEPTED'
       AND OLD.status <> 'ACCEPTED' THEN

        INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        SELECT
            c.user_id,
            'Proposal Accepted',
            CONCAT(
                'Your proposal for project "',
                p.title,
                '" has been accepted.'
            )
        FROM projects p
        INNER JOIN customers c
            ON p.customer_id = c.customer_id
        WHERE p.project_id = NEW.project_id;

    END IF;

END$$

DELIMITER ;