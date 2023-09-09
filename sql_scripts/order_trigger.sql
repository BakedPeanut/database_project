DELIMITER //

CREATE TRIGGER UpdateWarehouseOnOrderStatusChange
AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    DECLARE old_status ENUM('Pending', 'Rejected', 'Accepted');
    DECLARE new_status ENUM('Pending', 'Rejected', 'Accepted');
    
    -- Declare cursor and associated variables
    DECLARE orderProductId INT;
    DECLARE orderProductVolume INT;
    DECLARE orderProductQuantity INT;
    DECLARE orderProductWarehouseId INT;
    DECLARE orderProductProductId INT;
   -- Update the warehouse volume and warehouse product quantities
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET @done = 0;
    DECLARE cur CURSOR FOR
		SELECT id, volume, quantity, warehouseID, productID
		FROM OrderProduct
		WHERE orderID = NEW.orderId;
	SET old_status = OLD.orderStatus;
    SET new_status = NEW.orderStatus;
    IF old_status = 'Pending' AND new_status = 'Rejected' THEN   
    
        OPEN cur;
        update_loop: LOOP
            FETCH cur INTO orderProductId, orderProductVolume, orderProductQuantity, orderProductWarehouseId, orderProductProductId;
            IF @done = 1 THEN
                LEAVE update_loop;
            END IF;
            
            -- Update the warehouse volume
            UPDATE Warehouse
            SET volume = volume + (orderProductVolume * orderProductQuantity)
            WHERE id = orderProductWarehouseId;
            
            -- Update the warehouse product quantity
            UPDATE WarehouseProduct
            SET quantity = quantity + orderProductQuantity
            WHERE warehouseId = orderProductWarehouseId
            AND productId = orderProductProductId;
        END LOOP;
        
        CLOSE cur;        
        -- Delete all OrderProduct records for the rejected order
        DELETE FROM OrderProduct WHERE orderID = NEW.orderId;
    END IF;
END;
//

DELIMITER ;
