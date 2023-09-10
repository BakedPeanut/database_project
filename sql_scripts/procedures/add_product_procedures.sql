USE database_project;
drop procedure AddProductToWarehouse;
DELIMITER //
CREATE PROCEDURE AddProductToWarehouse(
    p_width INT, 
    p_length INT, 
    p_height INT, 
    p_inStock INT, 
    p_title VARCHAR(255), 
    p_description TEXT, 
    p_price DECIMAL(10,2), 
    p_img VARCHAR(255), 
    p_category VARCHAR(255),
    p_sellerAccount VARCHAR(255)
)
BEGIN
    -- Define variables for the product's total volume, the remaining volume required to allocate, and an indicator if the allocation is completed.
    DECLARE productVolume, remainingVolume, allocatedQuantity, orderVolume INT;
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
    -- Calculate the product's total volume.
    SET productVolume = p_width * p_length * p_height * p_inStock;

    -- Insert the product details into the Product table and capture the new product's ID.
    INSERT INTO Product(width, length, height, inStock, title, description, price, img, category, sellerID)
    VALUES(p_width, p_length, p_height, p_inStock, p_title, p_description, p_price, p_img, p_category, p_sellerAccount);

    SET newProductId = LAST_INSERT_ID();
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
        	SET allocatedQuantity = p_inStock;
            -- Update warehouse's available volume
            UPDATE Warehouse SET volume = volume - productVolume WHERE id = currentWarehouseId;
            
            -- Insert the quantity of the product into the WarehouseProduct table
            INSERT INTO WarehouseProduct(warehouseId, productId, quantity)
            VALUES(currentWarehouseId, newProductId, allocatedQuantity);
			SET productVolume = 0;
            SET allocationComplete = 1;
        ELSE
            -- Calculate how many units can be stored in the current warehouse
            select (remainingVolume - orderVolume) , p_width , p_length , p_height as message;
            SET allocatedQuantity = FLOOR((remainingVolume - orderVolume) / (p_width * p_length * p_height));
            IF (allocatedQuantity > 0) THEN
				-- Update the product volume and in-stock count for the next iteration
				SET productVolume = productVolume - (allocatedQuantity * p_width * p_length * p_height);
				SET p_inStock = p_inStock - allocatedQuantity;

				-- Update warehouse's available volume to 0 since it's full now
				UPDATE Warehouse SET volume = remainingVolume - (allocatedQuantity * p_width * p_length * p_height) WHERE id = currentWarehouseId;
				
				-- Insert the quantity of the product into the WarehouseProduct table
				INSERT INTO WarehouseProduct(warehouseId, productId, quantity)
				VALUES(currentWarehouseId, newProductId, allocatedQuantity);
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
