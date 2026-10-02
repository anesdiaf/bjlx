1. Categories | Usual data, meatadata, file upload |
2. Products | Usual data, meatadata, file upload |
3. Shipping providers | name, info (phone, address) | 
4. Shipping  zones ([spID], szID, wialya, commune, price, type), gui side -> i create shipping zones based on the shipping provider im going to work with, then attach the provider/s to these zones
5. Cart (total items) & checkout (shipping, note) | calculations, calculate shipping based on location (wilaya, commune) but give the customer the ability to modify shipping destination (reo -> customer dest) |
6. Orders
7. Required page (privacy, contact...)


Stopped at creating cart orders server actions and testing
& Ordering zone by wilaya code at Shipping admin and quick order and checkout


Important: 
1. ✅ Should add payment status to orders to check if shipping provider has delivered my money
    1.2. Should add a type to order status to check with it, types are (preparation, delivered, return, refund) ✅ (There's no need since i can list order statuses then search with them)
2. ✅ Should a constraint in the variant forms (add & edit) to check if promo is true price should be defined



✅ design cart page then ✅checkout then move to ✅order creation then ⏳editing orders and ✅handling history and ⏳returns


The ideal image aspect should be a an aspect of a square 1:1


Should visit atomic website to get an idea about checkout and quick orders because the standards of shopify


Actual Todos (These deferred because i need to prioritize things over others):

1. Add category image on category edit page 

2. Choose better fonts

3. ✅ Buy now dialog should check if user is logged in

4. ✅ Customer can't order if stock is track and stock is 0 or below

5. Consider giving zones titles and map coords

6. Should get all values available for a product then setup pairs dynamically each attribute value should get it's possible choices like argenté we have only L and S so M should be disabled



Temp Notes:

Data I Need With Order/Order-Item


UI sections for order or quick order

Info of customer

shipping 

Payment

Calculations (sub-total, discount, qty, shipping fees, total)
