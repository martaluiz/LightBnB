INSERT INTO users (name, email, password)
VALUES 
  ('Eva Stanley','sebastianguerra@gmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Louisa Meyer','jacksonrose@hotmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('Dominic Parks','victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) 
VALUES (1,1, 'Blank corner', 'description','https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 534, 4, 4, 3, 'Canada', '651 Nami Road', 'Bohbatev', 'Alberta', 839780, true),
(2,8, 'game fill', 'description', 'https://images.pexels.com/photos/1756826/pexels-photo-2076739.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/1756826/pexels-photo-1756826.jpeg', 852, 6, 6, 7, 'Canada', '834 Buwmi Road', 'Upfufa', 'Nova Scotia', 383789, true),
(3,1, 'speed lamp', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350','https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 134, 1, 2, 1, 'Canada', '651 Yaletown Road', 'Bohbatev', 'Alberta', 837380, true);


INSERT INTO reservations (id, start_date, end_date, property_id, guest_id)
VALUES (1,'2018-09-11','2018-09-26',2,3),
(2,'2019-01-04','2019-02-01',2,2),
(3,'2021-10-01','2021-10-14',1,4);


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2, 1, 1, 3, 'message'),
(1, 2, 1, 4, 'message'),
(8, 1, 2, 4, 'message');