-- CreateTable
CREATE TABLE "Account" (
    "account_number" SERIAL NOT NULL,
    "account_type" TEXT NOT NULL,
    "account_status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "account_nickname" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("account_number")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
