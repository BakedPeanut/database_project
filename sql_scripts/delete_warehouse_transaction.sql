-- Check if the warehouse has associated products
SELECT COUNT(*) INTO @productCount
FROM product
WHERE warehouse_id = ...;

-- Delete the warehouse only if there are no associated products
IF @productCount = 0 THEN
    DELETE FROM warehouse WHERE id = ...;
END IF;
