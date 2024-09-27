CREATE TABLE IF NOT EXISTS "onboard" (
	"id" serial PRIMARY KEY NOT NULL,
	"food" varchar(50) NOT NULL,
	"hobby" varchar(50) NOT NULL,
	"nickname" varchar(50) NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onboard" ADD CONSTRAINT "onboard_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
