INSERT INTO public.account (
    account_firstname, account_lastname,
    account_email, account_password
)
VALUES (
    'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n'
);



UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';


DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';


UPDATE public.INVENTORY
SET inv_description = REPLACE(inv_description, 'small interiors','a huge interiors')
WHERE (inv_make = 'GM' AND inv_model = 'Hummer');


SELECT inv.inv_make, inv.inv_model, clas.classification_name
FROM public.inventory inv
INNER JOIN public.classification clas
ON inv.classification_id = clas.classification_id
WHERE clas.classification_name = 'Sport';


UPDATE public.INVENTORY
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
