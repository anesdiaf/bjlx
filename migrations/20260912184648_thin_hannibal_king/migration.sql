CREATE TABLE "carousel_images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "carousel_images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"carousel_id" integer,
	"image" text,
	"file" text,
	"lang" varchar(2),
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "carousel" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "carousel_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "carousel_images" ADD CONSTRAINT "carousel_images_carousel_id_carousel_id_fkey" FOREIGN KEY ("carousel_id") REFERENCES "carousel"("id");