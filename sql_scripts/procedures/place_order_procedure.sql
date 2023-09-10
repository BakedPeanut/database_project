	USE database_project;
	DELIMITER //

	CREATE PROCEDURE PlaceOrder(
		IN p_customerID INT
	)
	BEGIN
		DECLARE result bool;
		DECLARE v_orderId INT;
		DECLARE v_productId INT;
		DECLARE v_quantity INT;
		DECLARE v_inStock INT;
		DECLARE v_orderedQuantity INT;
		DECLARE v_warehouseId INT;
		DECLARE v_warehouse_quantity INT;
		DECLARE v_cartDetailId INT;  
		DECLARE cartCount INT default 0;
		DECLARE done INT default 0;
		-- Cursor for retrieving cart details
		DECLARE cart_cursor CURSOR FOR
			SELECT cd.cartDetailId, cd.productId, cd.quantity
			FROM CartDetail cd
			WHERE cd.cartId = (SELECT cartId FROM Cart WHERE customerID = p_customerID);
			
		DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
		BEGIN
			-- Set the result to an error message
			ROLLBACK;
			RESIGNAL;
		END;
		
		DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
        
		SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

		start transaction;
		-- Create a new order with the provided customerID
		INSERT INTO Orders (customerID) VALUES (p_customerID);
		SET v_orderId = LAST_INSERT_ID();

		OPEN cart_cursor;
		
		cart_loop: LOOP
			FETCH cart_cursor INTO v_cartDetailId, v_productId, v_quantity;
			IF done = 1 THEN
				CLOSE cart_cursor;
				LEAVE cart_loop;
			END IF;
			-- Check product availability
			SELECT inStock INTO v_inStock FROM Product WHERE id = v_productId;

	   --      -- If inStock is greater than 0, process the item
			IF v_inStock > 0 THEN
				SET cartCount = cartCount + 1;
				
				-- Calculate the quantity to order based on availability
				IF v_inStock >= v_quantity THEN
					SET v_orderedQuantity = v_quantity;
				ELSE
					SET v_orderedQuantity = v_inStock;
				END IF;
				
				-- Create new OrderDetail record
				INSERT INTO OrderDetail (orderId, productId, quantity) VALUES (v_orderId, v_productId, v_orderedQuantity);
				call DeductProductFromWarehouse(v_productId, v_orderedQuantity, v_orderId);
				-- Remove the cartDetail record
				DELETE FROM CartDetail WHERE cartDetailId = v_cartDetailId;
			END IF;
		END LOOP;
		
		   
		IF cartCount = 0 THEN
			select 'no items in stock or the cart empty' as message;
			rollback;
		ELSE
			DELETE FROM Cart WHERE customerID = p_customerID;
			commit;
			SELECT 'Order placed successfully' AS message;
		END IF;
		
	END //

	DELIMITER ;