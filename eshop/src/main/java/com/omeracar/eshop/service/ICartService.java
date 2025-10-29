package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.cart.AddItemToCartRequestDto;
import com.omeracar.eshop.dto.cart.CartResponseDto;
import jakarta.validation.constraints.Min;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

public interface ICartService {

    CartResponseDto getCartForCurrentUser();

    CartResponseDto addItemToCart(AddItemToCartRequestDto addItemDto);

    CartResponseDto updateCartItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam @Min(value = 1, message = "Miktar en az 1 olmalı") Integer quantity);

    CartResponseDto removeCartItem(Long cartItemId);

    CartResponseDto clearCart();


}
