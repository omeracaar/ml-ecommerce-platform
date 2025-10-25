package com.omeracar.eshop.repository;

import com.omeracar.eshop.model.Cart;
import com.omeracar.eshop.model.CartItem;
import com.omeracar.eshop.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
}
