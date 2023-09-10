use database_project;

DELIMITER //
CREATE TRIGGER trg_product_insert 
AFTER INSERT ON Product -- Trigger when add new product
FOR EACH ROW
BEGIN
    INSERT INTO Product_FullText (title, description, productID)
    VALUES (NEW.title, NEW.description, NEW.id); -- Add the new title and descrip 
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER trg_product_update
AFTER UPDATE ON Product  -- Trigger when update  product
FOR EACH ROW
BEGIN
    IF NEW.title != OLD.title OR NEW.description != OLD.description THEN 
        UPDATE Product_FullText
        SET title = NEW.title, description = NEW.description  -- Update the new title and descrip 
        WHERE productID = NEW.id;
    END IF;
END;
//
DELIMITER ;
