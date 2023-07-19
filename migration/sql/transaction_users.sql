 create table transaction_users (
  id_transaction serial primary key not null,
  id_user_sender int not null,
  id_user_receiver int not null,
  amount int not null,
  notes text null,
  create_at timestamp not null DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_user_sender) REFERENCES users (id_user),
   FOREIGN KEY (id_user_receiver) REFERENCES users (id_user)
  );