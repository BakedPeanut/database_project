use database_project;

DELIMITER //
CREATE PROCEDURE UpdateProductQuantity(
    p_productId INT, 
    p_addQuantity INT
)
BEGIN
    -- Variables
    DECLARE productVolume INT;
    DECLARE productWidth, productLength, productHeight, remainingVolume, allocatedQuantity, orderVolume INT;
    DECLARE allocationComplete INT DEFAULT 0;
    DECLARE currentWarehouseId INT;
    -- Create a cursor to fetch warehouses ordered by available volume (from the largest available volume).
    DECLARE warehouseCursor CURSOR FOR
        SELECT id, volume 
        FROM Warehouse 
        ORDER BY volume DESC;

    -- Fetch product dimensions
    SELECT width, length, height INTO productWidth, productLength, productHeight
    FROM Product
    WHERE id = p_productId;

    -- Calculate the total volume needed for the additional quantity
    SET productVolume = productWidth * productLength * productHeight * p_addQuantity;

    -- Open the cursor.
    OPEN warehouseCursor;

    -- Loop through the warehouses to allocate product stock.
    warehouseAllocationLoop: LOOP
        FETCH warehouseCursor INTO currentWarehouseId, remainingVolume;
        
        IF allocationComplete = 1 OR productVolume <= 0 THEN
            LEAVE warehouseAllocationLoop;
        END IF;

		SELECT SUM(volume) INTO orderVolume
			FROM OrderProduct
			WHERE warehouseID = currentWarehouseId;

        IF productVolume <= remainingVolume - orderVolume THEN
            -- The entire quantity can be stored in this warehouse
            SET allocatedQuantity = p_addQuantity;
            
            -- Update warehouse's available volume
            UPDATE Warehouse SET volume = volume - productVolume WHERE id = currentWarehouseId;

            -- Update the WarehouseProduct table
            INSERT INTO WarehouseProduct(warehouseId, productId, quantity)
            VALUES(currentWarehouseId, p_productId, allocatedQuantity)
            ON DUPLICATE KEY UPDATE quantity = quantity + allocatedQuantity;

			SET remainingVolume = 0;
            SET allocationComplete = 1;
        ELSE
            -- Calculate how many units can be stored in the current warehouse
            SET allocatedQuantity = FLOOR(remainingVolume - orderVolume / (productWidth * productLength * productHeight));

            -- Update the remaining volume for the next iteration
            SET productVolume = productVolume - (allocatedQuantity * productWidth * productLength * productHeight);

            -- Update the WarehouseProduct table
            INSERT INTO WarehouseProduct(warehouseId, productId, quantity)
            VALUES(currentWarehouseId, p_productId, allocatedQuantity)
            ON DUPLICATE KEY UPDATE quantity = quantity + allocatedQuantity;

            -- Update warehouse's available volume to 0 since it's full now
            UPDATE Warehouse SET volume = remainingVolume - (allocatedQuantity * productWidth * productLength * productHeight) WHERE id = currentWarehouseId;
        END IF;

    END LOOP warehouseAllocationLoop;

    -- Close the cursor.
    CLOSE warehouseCursor;

    -- Raise an exception if there's still some product left unallocated after checking all warehouses.
    IF remainingVolume > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough space in any warehouse for the added stock.';
    END IF;

END//
DELIMITER ;
