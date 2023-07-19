CREATE TABLE public.users (
	id_user serial primary key NOT NULL,
  username varchar(255) NOT NULL,
	first_name text NOT NULL,
	last_name text NOT NULL,
	phone varchar(15) NULL,
	email text NOT NULL,
	pass text NOT NULL,
	status_verification bpchar(1) NOT NULL DEFAULT '0'::bpchar,
	"role" varchar(6) NOT NULL DEFAULT 'user'::character varying,
	pin varchar(6) null,
	balance int NOT NULL DEFAULT 0,
	image text NOT NULL DEFAULT '/public/img/Default_Profile.png'::text
);