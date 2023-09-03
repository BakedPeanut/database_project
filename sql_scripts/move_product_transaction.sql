START TRANSACTION;

-- Calculate total volume of products being moved
SELECT SUM(width * length * height) INTO @totalVolume
FROM product
WHERE id IN (...);

-- Check if destination warehouse has enough space
SELECT volume INTO @destinationWarehouseVolume
FROM warehouse
WHERE id = ...;

-- Calculate the volume change for source and destination warehouses
SET @sourceWarehouseId = ...; -- ID of the source warehouse
SELECT volume INTO @sourceWarehouseVolume
FROM warehouse
WHERE id = @sourceWarehouseId;

SET @volumeChange = @totalVolume - @destinationWarehouseVolume;

-- Compare destination volume with total product volume
IF @destinationWarehouseVolume >= @totalVolume THEN
    -- Update products with new warehouse ID
    UPDATE product
    SET warehouse_id = ...
    WHERE id IN (...);

    -- Update destination warehouse volume
    UPDATE warehouse
    SET volume = volume - @volumeChange
    WHERE id = ...;

    -- Update source warehouse volume
    UPDATE warehouse
    SET volume = volume + @volumeChange
    WHERE id = @sourceWarehouseId;

    COMMIT;
ELSE
    ROLLBACK;
END IF;
