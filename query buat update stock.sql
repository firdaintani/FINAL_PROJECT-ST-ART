select * from product;
select * from categories;
select * from order_user;

select * from order_item;

use latihan;
show events from latihan;

drop event test_event_03;

CREATE EVENT test_event_04
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 2 day
ON COMPLETION NOT PRESERVE
DO
   INSERT INTO categories(name)
   VALUES('haha');
   

CREATE EVENT test_event_05
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 10 second
ON COMPLETION NOT PRESERVE
DO
   delete from order_item where idorder=4;
   delete from order_user where id=4;

delimiter |

CREATE EVENT test_event_05
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 10 second
ON COMPLETION NOT PRESERVE
    DO
      BEGIN
   delete from order_item where idorder=4;
   delete from order_user where id=4;
      END |

delimiter ;

   
delete from order_item where idorder=2;  
delete from order_user where id=2;
 select * from order_item;
select * from product;
select * from order_user;

delete from order_item where idorder=3;
delete from order_user where id=3;