package com.omeracar.eshop.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Bu sipariş öğesinin ait olduğu SİPARİŞ (Many-to-One).
     * Bu taraf ilişkinin sahibidir, 'order_items' tablosuna 'order_id' kolonu eklenir.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore
    private Order order; // Order.java'yı az önce oluşturduk


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    //urunun satin alindigi zamanki fiyatı zam gelse dahi zarar etmeyiz
    @Column(name = "price_at_purchase", nullable = false)
    private double priceAtPurchase;


}
