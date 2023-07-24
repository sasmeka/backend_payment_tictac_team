-- INSERT TABLE users
INSERT INTO public.users
(id_user, username, first_name, last_name, phone, email, pass, status_verification, "role", pin, balance, image)
VALUES(2, 'user2', 'user', '2', '', 'user2@gmail.com', '$2b$10$AhMp8wE9G2uwbiaJDaION.xt.GOi7KwOz07CGMVIWiqy69FMuhHh.', '1', 'user', NULL, 19000, '/public/img/Default_Profile.png');
INSERT INTO public.users
(id_user, username, first_name, last_name, phone, email, pass, status_verification, "role", pin, balance, image)
VALUES(1, 'user1', 'user', '1', '', 'user1@gmail.com', '$2b$10$yklheij9vslc2GC1xTEjZOmwxthcT.LllLjC.9QS2UA7OJX9Np7lG', '1', 'user', NULL, 26000, '/public/img/Default_Profile.png');

-- NB: password login = 123456

-- INSERT TABLE transaction_users
INSERT INTO public.transaction_users
(id_transaction, id_user_sender, id_user_receiver, amount, notes, create_at)
VALUES(5, 1, 2, 5000, 'buat jajan', '2023-08-19 12:24:15.940');
INSERT INTO public.transaction_users
(id_transaction, id_user_sender, id_user_receiver, amount, notes, create_at)
VALUES(6, 1, 2, 5000, 'beli kaos ', '2023-07-12 14:21:24.536');
INSERT INTO public.transaction_users
(id_transaction, id_user_sender, id_user_receiver, amount, notes, create_at)
VALUES(7, 1, 2, 1000, '', '2023-07-01 14:22:55.757');
INSERT INTO public.transaction_users
(id_transaction, id_user_sender, id_user_receiver, amount, notes, create_at)
VALUES(8, 2, 1, 1000, 'buat jajan', '2023-07-21 08:51:21.556');
INSERT INTO public.transaction_users
(id_transaction, id_user_sender, id_user_receiver, amount, notes, create_at)
VALUES(9, 2, 1, 2000, 'buat jajan', '2023-07-21 08:51:26.584');
INSERT INTO public.transaction_users
(id_transaction, id_user_sender, id_user_receiver, amount, notes, create_at)
VALUES(10, 2, 1, 4000, 'buat jajan', '2023-07-21 08:51:30.839');
