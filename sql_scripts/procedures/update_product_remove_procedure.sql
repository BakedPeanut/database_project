USE database_project;
DELIMITER //

CREATE PROCEDURE UpdateProductRemoveItems(
    IN p_productID INT,
    IN p_quantity INT
)
BEGIN
    -- Declare necessary variables
    DECLARE v_warehouseId INT;
    DECLARE v_warehouse_quantity INT;
    DECLARE v_width INT;
    DECLARE v_length INT;
    DECLARE v_height INT;
    DECLARE v_volumeReduction INT;
    DECLARE done INT DEFAULT 0;

    -- Declare cursor to get warehouses with the product
    DECLARE warehouse_cursor CURSOR FOR
        SELECT wp.warehouseId, wp.quantity
        FROM WarehouseProduct wp
        WHERE wp.productId = p_productID
        ORDER BY wp.quantity DESC;

    -- Handlers
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Fetch the product dimensions
    SELECT width, length, height 
    INTO v_width, v_length, v_height
    FROM Product
    WHERE id = p_productID;

    OPEN warehouse_cursor;

    warehouse_loop: LOOP
        FETCH warehouse_cursor INTO v_warehouseId, v_warehouse_quantity;

        IF done THEN
            LEAVE warehouse_loop;
        END IF;

        -- If the input quantity is higher than the warehouse's stock
        IF p_quantity > v_warehouse_quantity THEN
            -- Remove the entry from WarehouseProduct table
            DELETE FROM WarehouseProduct 
            WHERE warehouseId = v_warehouseId AND productId = p_productID;

            -- Adjust the input quantity
            SET p_quantity = p_quantity - v_warehouse_quantity;
        ELSE
            -- Reduce the quantity in WarehouseProduct table
            UPDATE WarehouseProduct 
            SET quantity = quantity - p_quantity
            WHERE warehouseId = v_warehouseId AND productId = p_productID;
            
            -- Adjust the volume of the warehouse
            SET v_volumeReduction = v_width * v_length * v_height * p_quantity;

            UPDATE Warehouse
            SET volume = volume + v_volumeReduction
            WHERE id = v_warehouseId;
            
            -- Set the input quantity to zero and exit the loop
            SET p_quantity = 0;
            LEAVE warehouse_loop;
        END IF;

        -- Adjust the volume of the warehouse
        SET v_volumeReduction = v_width * v_length * v_height * v_warehouse_quantity;

        UPDATE Warehouse
        SET volume = volume + v_volumeReduction
        WHERE id = v_warehouseId;
    END LOOP;

    CLOSE warehouse_cursor;

END //

DELIMITER ;
