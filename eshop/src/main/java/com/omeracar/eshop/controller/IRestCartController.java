package com.omeracar.eshop.controller;

import com.omeracar.eshop.dto.cart.AddItemToCartRequestDto;
import com.omeracar.eshop.dto.cart.CartResponseDto;
import org.springframework.http.ResponseEntity;

public interface IRestCartController {

    ResponseEntity<RootEntity<CartResponseDto>> getCart();

    ResponseEntity<RootEntity<CartResponseDto>> addItemToCart(AddItemToCartRequestDto addItemDto);

    ResponseEntity<RootEntity<CartResponseDto>> updateItemQuantity(Long cartItemId, Integer quantity);

    ResponseEntity<RootEntity<CartResponseDto>> removeItemFromCart(Long cartItemId);

    ResponseEntity<RootEntity<CartResponseDto>> clearCart();


}
