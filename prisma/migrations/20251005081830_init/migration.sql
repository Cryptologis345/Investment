/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionRef` on the `Transaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Success',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("amount", "createdAt", "description", "id", "status", "type", "userId") SELECT "amount", "createdAt", "description", "id", "status", "type", "userId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "mainBalance" REAL NOT NULL DEFAULT 0,
    "investmentBalance" REAL NOT NULL DEFAULT 0,
    "totalEarn" REAL NOT NULL DEFAULT 0,
    "totalDeposit" REAL NOT NULL DEFAULT 0,
    "totalWithdraw" REAL NOT NULL DEFAULT 0,
    "roi" REAL NOT NULL DEFAULT 0,
    "redeemedRoi" REAL NOT NULL DEFAULT 0,
    "speedInvest" REAL NOT NULL DEFAULT 0,
    "completed" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("completed", "createdAt", "email", "firstName", "id", "investmentBalance", "lastName", "mainBalance", "password", "phone", "redeemedRoi", "roi", "speedInvest", "totalDeposit", "totalEarn", "username") SELECT "completed", "createdAt", "email", "firstName", "id", "investmentBalance", "lastName", "mainBalance", "password", "phone", "redeemedRoi", "roi", "speedInvest", "totalDeposit", "totalEarn", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
