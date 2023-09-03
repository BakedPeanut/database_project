DELIMITER //

-- Create the stored procedure to assign a product to warehouses based on available space
CREATE PROCEDURE AssignProductToWarehouses(
    IN productId INT,
    IN productName VARCHAR(255),
    IN productVolume DECIMAL(10, 2),
    IN productWidth DECIMAL(10, 2),
    IN productLength DECIMAL(10, 2),
    IN productHeight DECIMAL(10, 2)
)
BEGIN
    -- Declare variables for warehouse ID and available space
    DECLARE warehouseId INT;
    DECLARE availableSpace DECIMAL(10, 2);
    
    -- Declare a cursor to loop through warehouses
    DECLARE warehouseCursor CURSOR FOR
        SELECT id, volume - (SELECT IFNULL(SUM(width * length * height), 0) FROM product WHERE warehouse_id = id) AS space
        FROM warehouse
        ORDER BY space DESC;
        
    -- Declare a handler for cursor not found
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET @finished = TRUE;

    -- Open the cursor
    OPEN warehouseCursor;
    SET @finished = FALSE;

    -- Loop through warehouses
    warehouse_loop: LOOP
        FETCH warehouseCursor INTO warehouseId, availableSpace;
        IF @finished THEN
            CLOSE warehouseCursor;
            LEAVE warehouse_loop;
        END IF;

        -- Check if available space in the warehouse is sufficient for the product
        IF availableSpace >= productVolume THEN
            -- Insert the product into the warehouse
            INSERT INTO product (id, name, volume, width, length, height, warehouse_id)
            VALUES (productId, productName, productVolume, productWidth, productLength, productHeight, warehouseId);
            LEAVE warehouse_loop;
        END IF;
    END LOOP;

    -- Close the cursor
    CLOSE warehouseCursor;
END;
//

DELIMITER ;
