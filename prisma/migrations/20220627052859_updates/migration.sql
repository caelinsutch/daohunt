-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "DaoCategory" AS ENUM ('Collector', 'Grants', 'Impact', 'Investment', 'Media', 'Product', 'Protocol', 'Service', 'SocialCommunity');

-- CreateEnum
CREATE TYPE "DaoTags" AS ENUM ('Analytics', 'Art', 'Culture', 'DaoTool', 'DeFi', 'Developers', 'FutureOfWork', 'Gaming', 'Incubator', 'Infastructure', 'Metaverse', 'Music', 'NFTs', 'P2e', 'PublicGoodFunding', 'RealWorldAssetPUrhase', 'Science', 'Sports', 'Sustainability', 'Venture');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dao" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "category" "DaoCategory" NOT NULL,
    "tags" "DaoTags"[],
    "photo" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "twitter" TEXT,
    "discord" TEXT,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" UUID NOT NULL,

    CONSTRAINT "Dao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Dao_slug_key" ON "Dao"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Dao_name_key" ON "Dao"("name");

-- AddForeignKey
ALTER TABLE "Dao" ADD CONSTRAINT "Dao_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
