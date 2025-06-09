## Project Summary
This project is a backend REST API for an e-commerce platform built using NestJS and TypeORM. 
It manages users, products, categories, orders, reviews, and their relationships, allowing CRUD operations and complex queries like top-reviewed products

## Entities & Their Relationships

1. User

   Can have one or more Addresses (One-to-many with Address)
   
   Can place many Orders (One-to-many with Order)
   
   Can write many Reviews (One-to-many with Review)


2. Address
   
   Belongs to one User (Many-to-one with User)
   
   Stores user’s multiple addresses 


3. Product

   Belongs to one or more Categories (Many-to-One with Category)
   
   Can have many Reviews (One-to-many with Review)
   
   Can be part of many OrderItems (One-to-many with OrderItem)


4. Category

   Has many Products (one-to-many with Product)


5. Order

   Belongs to one User (Many-to-one with User)
   
   Has many OrderItems (One-to-many with OrderItem)


6. OrderItem

   Belongs to one Order (Many-to-one with Order)
   
   Refers to one Product (Many-to-one with Product)


7. Review

   Belongs to one User (Many-to-one with User)
   
   Belongs to one Product (Many-to-one with Product)


## Transaction 
Used queryRunner for transaction while creating and updating orders (initially using typeorm-transactional package for transaction but skiped that due to erros)

## Migrations 
1. Generate <br>
   npm run migration:generate <br>
2. Run <br>
   npm run migration:generate <br>
3. Revert <br>
   npm run migration:revert <br>
4. Create <br>
   npm run migration:create -- ./src/database/migrations/{MigrationName}-migration  <br>
5. Drop tables <br>
   npm run drop:tables  <br>


## Postman Link
https://www.postman.com/shivamdeswal/workspace/nestbasics/collection/45022719-ebebfee8-f24e-40ee-9a4f-e14f9918eaf2?action=share&source=copy-link&creator=45022719
