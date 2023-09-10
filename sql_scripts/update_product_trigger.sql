DELIMITER //
CREATE TRIGGER trg_after_update_product
AFTER UPDATE ON Product
FOR EACH ROW
BEGIN
    IF NEW.inStock > OLD.inStock THEN
        CALL UpdateProductQuantity(NEW.id, NEW.inStock - OLD.inStock);
    END IF;
END //
DELIMITER ;