/*
  Warnings:

  - You are about to drop the `reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reviewresponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reservation` DROP FOREIGN KEY `Reservation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `reviewresponse` DROP FOREIGN KEY `ReviewResponse_reviewId_fkey`;

-- DropTable
DROP TABLE `reservation`;

-- DropTable
DROP TABLE `reviewresponse`;

-- CreateIndex
CREATE INDEX `CartItem_cartId_productId_idx` ON `CartItem`(`cartId`, `productId`);

-- CreateIndex
CREATE INDEX `Favorite_buyerId_productId_idx` ON `Favorite`(`buyerId`, `productId`);

-- CreateIndex
CREATE INDEX `Product_name_idx` ON `Product`(`name`);

-- CreateIndex
CREATE INDEX `Product_price_idx` ON `Product`(`price`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- RenameIndex
ALTER TABLE `cart` RENAME INDEX `Cart_buyerId_fkey` TO `Cart_buyerId_idx`;

-- RenameIndex
ALTER TABLE `order` RENAME INDEX `Order_buyerId_fkey` TO `Order_buyerId_idx`;
