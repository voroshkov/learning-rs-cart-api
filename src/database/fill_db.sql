INSERT INTO "users"("name", "password", "first_name", "last_name")
VALUES ('voroshkov', '', 'andrey', 'voroshkov');

INSERT INTO "carts"("user_id", "status")
SELECT (SELECT id
        FROM "users"
        WHERE name = 'voroshkov'),
       'OPEN'
;

INSERT INTO public.products
(id, title, description, price)
VALUES('011853ca-238e-40e7-afa6-d1973df9f064'::uuid, 'AV Product C', 'AV Short Product Description2', 15);
INSERT INTO public.products
(id, title, description, price)
VALUES('c53db874-2436-4fd8-954b-5d9d99b2594b'::uuid, 'AV Product A', 'AV Short Product Description1', 5);


INSERT INTO "cart_items"("cart_id", "product_id", "count")
SELECT (SELECT id FROM carts WHERE status = 'OPEN' LIMIT 1),
        '011853ca-238e-40e7-afa6-d1973df9f064'
       42;

INSERT INTO "orders"("cart_id", "user_id", "payment", "delivery", "comments", "status", "total")
SELECT (SELECT id FROM carts WHERE status = 'OPEN' LIMIT 1),
       (SELECT id FROM "users" WHERE name = 'voroshkov'),
       '{"type":"card","address":"Minsk","creditCart":"123"}',
       '{"type":"default","address":"Minsk"}',
       'comment',
       'OPEN',
       42;
