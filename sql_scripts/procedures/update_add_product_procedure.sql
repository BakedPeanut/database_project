USE database_project;
drop procedure UpdateProductQuantity;
DELIMITER //
CREATE PROCEDURE UpdateProductQuantity(
    p_productId INT, 
    p_addQuantity INT
)
BEGIN
    -- Define variables for the product's total volume, the remaining volume required to allocate, and an indicator if the allocation is completed.
    DECLARE productVolume, remainingVolume, allocatedQuantity, orderVolume, oldInStock INT DEFAULT 0;
	DECLARE p_width, p_length, p_height INT;
	DECLARE count INT default 0;
    DECLARE allocationComplete INT DEFAULT 0;
    DECLARE currentWarehouseId INT;
    DECLARE newProductId INT;
	DECLARE done INT default 0;

    -- Create a cursor to fetch warehouses ordered by available volume (from the largest available volume).
    DECLARE warehouseCursor CURSOR FOR
        SELECT id, volume 
        FROM Warehouse 
        ORDER BY volume DESC;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
		BEGIN
			-- Set the result to an error message
			ROLLBACK;
			RESIGNAL;
		END;
	SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

	start transaction;
	SELECT width, length, height, inStock INTO p_width, p_length, p_height, oldInStock
    FROM Product
    WHERE id = p_productId;
	
    if oldInStock < p_addQuantity then
		Rollback;
	end if;
    -- Calculate the product's total volume.
    SET productVolume = p_width * p_length * p_height * (p_addQuantity - oldInStock);

    -- Open the cursor.
    OPEN warehouseCursor;

    -- Loop through the warehouses to allocate product stock.
    warehouseAllocationLoop: LOOP
        FETCH warehouseCursor INTO currentWarehouseId, remainingVolume;
		IF done = 1 THEN
			LEAVE warehouseAllocationLoop;
		END IF;
        -- If allocation is completed or no available volume in the warehouse, end the loop.
        IF allocationComplete = 1 OR productVolume <= 0 THEN
            LEAVE warehouseAllocationLoop;
        END IF;
		
		SELECT COALESCE(SUM(volume), 0)INTO orderVolume
		FROM OrderProduct
		WHERE warehouseID = currentWarehouseId;
		
        -- If the current warehouse can accommodate the entire remaining product volume.
        IF productVolume <= remainingVolume - orderVolume THEN
            SET allocatedQuantity = p_addQuantity;

            -- Update warehouse's available volume

            UPDATE Warehouse SET volume = volume - productVolume WHERE id = currentWarehouseId;
			
            -- Insert the quantity of the product into the WarehouseProduct table
            INSERT INTO WarehouseProduct(warehouseId, productId, quantity)
            VALUES(currentWarehouseId, p_productId, allocatedQuantity)
			ON DUPLICATE KEY UPDATE quantity = quantity + allocatedQuantity;

			SET productVolume = 0;
            SET allocationComplete = 1;
        ELSE

            -- Calculate how many units can be stored in the current warehouse
            SET allocatedQuantity = FLOOR((remainingVolume - orderVolume) / (p_width * p_length * p_height));
            -- Update the product volume and in-stock count for the next iteration
            SET productVolume = productVolume - (allocatedQuantity * p_width * p_length * p_height);

            -- Update warehouse's available volume to 0 since it's full now
            UPDATE Warehouse SET volume = remainingVolume - (allocatedQuantity * p_width * p_length * p_height) WHERE id = currentWarehouseId;
            SELECT COUNT(*) INTO count
			FROM WarehouseProduct
			WHERE warehouseId = currentWarehouseId AND productId = p_productId;
			IF count = 0 THEN
				-- Insert the record
				INSERT INTO WarehouseProduct(warehouseId, productId, quantity)
				VALUES(currentWarehouseId, p_productId, allocatedQuantity);
			ELSE
				UPDATE WarehouseProduct
				SET quantity = quantity + allocatedQuantity
				WHERE warehouseId = currentWarehouseId AND productId = p_productId;
			END IF;
        END IF;

    END LOOP warehouseAllocationLoop;

    -- Close the cursor.
    CLOSE warehouseCursor;

    -- Raise an exception if there's still some product left unallocated after checking all warehouses.
   IF productVolume > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough space in any warehouse for the entire stock.';
        ROLLBACK;
	ELSE
		COMMIT;
    END IF;

END//

DELIMITER ;
