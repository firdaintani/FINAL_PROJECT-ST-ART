use mydb;
select * from order_user;
insert into order_user (username, total, order_date, payment_due) values ('firda',20000, now(), now()+interval 2 day);
select last_insert_id() from order_user;
select str_to_date('5 June 2019 12:43:1', '%d %M %Y %H:%i:%s');
insert into order_user (username, total, order_date, payment_due) values ('firda',20000, str_to_date('5-6-2019', '%d-%m-%Y'),str_to_date('7-6-2019', '%d-%m-%Y') );
insert into order_user (username, total, order_date, payment_due) values ('firda',20000, str_to_date('5 June 2019 12:43:1', '%d %M %Y %H:%i:%s'),str_to_date('5 June 2019 12:43:1', '%d %M %Y %H:%i:%s') );
select id from order_user where username = 'firda' and order_date=str_to_date('5 June 2019 12:43:1', '%d %M %Y %H:%i:%s');
select total,payment_due, account_name, account_number, bank_pict from order_user join payment_account on order_user.payment_bank=payment_account.id where order_user.id=108;

show create view for_pdf;
 select `order_user`.`id` AS `id`,`user`.`username` AS `username`,`user`.`email` AS `email`,DATE_FORMAT(order_date, "%d %M %Y %H:%i:%s") AS `order_date`,`order_user`.`total` AS `alltotal`,`order_user`.`address` AS `address`,`pc`.`city` AS `city`,`pd`.`province_name` AS `province_name`,`pc`.`postal_code` AS `postal_code`,`pc`.`urban` AS `urban`,`pc`.`sub_district` AS `sub_district`,`product`.`name` AS `name`,`order_item`.`qty` AS `qty`,`order_item`.`total` AS `total` from (((((`order_item` join `product` on((`order_item`.`id_product` = `product`.`id`))) join `order_user` on((`order_user`.`id` = `order_item`.`id_order`))) join `user` on((`order_user`.`username` = `user`.`username`))) join `db_postal_code_data` `pc` on((`order_user`.`idAddress` = `pc`.`id`))) join `db_province_data` `pd` on((`pc`.`province_code` = `pd`.`province_code`)));