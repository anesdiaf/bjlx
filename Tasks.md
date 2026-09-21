1. Categories | Usual data, meatadata, file upload |
2. Products | Usual data, meatadata, file upload |
3. Shipping providers | name, info (phone, address) | 
4. Shipping  zones ([spID], szID, wialya, commune, price, type), gui side -> i create shipping zones based on the shipping provider im going to work with, then attach the provider/s to these zones
5. Cart (total items) & checkout (shipping, note) | calculations, calculate shipping based on location (wilaya, commune) but give the customer the ability to modify shipping destination (reo -> customer dest) |
6. Orders
7. Required page (privacy, contact...)


Stopped at product variants when there's more then 1 attribute like color and size then move to cart then shipping providers (set price per city and sometimes commune)


The ideal image aspect should be a an aspect of a square 1:1
The form should be image (blob), url (input), path/uuid (i should receive this after uploading the image), and order (no 1 should be the main image) and a thumbnail or two for dynamic product thumbnail


Should visit atomic website to get an idea about checkout and quick orders because the standards of shopify


Actual Todos (These deferred because i need to prioritize things over others):

1. Add category image on category edit page 

2. Choose better fonts

3. Buy now dialog should check if user is logged in

4. Customer can't order if stock is track and stock is 0 or below





Temp Notes:

Data I Need With Order/Order-Item

Product ID
Variant ID (With this i can handle all the other data since the attributes are linked to this)