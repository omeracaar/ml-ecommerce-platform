package com.omeracar.eshop.repository;

import com.omeracar.eshop.model.CartItem;
import com.omeracar.eshop.model.Order;
import com.omeracar.eshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(String userId);
}
