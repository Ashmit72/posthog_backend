ALTER TABLE "users" ADD COLUMN "profilePicture" varchar(200);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_profilePicture_unique" UNIQUE("profilePicture");