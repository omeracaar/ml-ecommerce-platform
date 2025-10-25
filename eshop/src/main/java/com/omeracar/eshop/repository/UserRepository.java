package com.omeracar.eshop.repository;

import com.omeracar.eshop.model.Category;
import com.omeracar.eshop.model.Product;
import com.omeracar.eshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

}
