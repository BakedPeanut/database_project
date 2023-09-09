USE database_project;

DELIMITER //
CREATE PROCEDURE AddToCart(p_customerID INT, p_productId INT)
BEGIN

    DECLARE v_inStock INT;
    DECLARE v_cartId INT;
    DECLARE v_quantity INT DEFAULT 0;
    
    -- Get the product's in-stock quantity
    SELECT inStock INTO v_inStock FROM Product WHERE id = p_productId;

    -- Check if the user has a cart, if not, create one
    SELECT cartId INTO v_cartId FROM Cart WHERE customerID = p_customerID;

    IF v_cartId IS NULL THEN
        INSERT INTO Cart(customerID) VALUES(p_customerID);
        SET v_cartId = LAST_INSERT_ID();
    END IF;

    -- Check if the product is already in the cart details
    SELECT quantity INTO v_quantity FROM CartDetail WHERE cartId = v_cartId AND productId = p_productId;

    IF v_inStock > 0 THEN
        IF v_quantity = 0 THEN
            -- Product is not in the cart details, so add it with a quantity of 1
            INSERT INTO CartDetail(cartId, productId, quantity) VALUES(v_cartId, p_productId, 1);
        ELSEIF v_quantity < v_inStock THEN
            -- Product is already in the cart details, so increase its quantity
            UPDATE CartDetail SET quantity = v_quantity + 1 WHERE cartId = v_cartId AND productId = p_productId;
        ELSE
            -- Product stock is not sufficient to increase the quantity
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough product in stock';
        END IF;
    ELSE
        -- Product is out of stock
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Product is out of stock';
    END IF;

END //
DELIMITER ;


