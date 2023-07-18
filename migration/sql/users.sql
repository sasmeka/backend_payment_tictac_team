  create table users(
  id_user serial primary key not null,
  first_name text not null,
  last_name text not null,
  phone varchar(15) not null,
  email text not null,
  pass text not null,
  status_verification char(1) DEFAULT '0',
  "role" varchar(6) NOT NULL DEFAULT 'user'::character varying
  );