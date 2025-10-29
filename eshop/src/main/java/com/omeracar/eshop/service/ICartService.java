package com.omeracar.eshop.service;

import com.omeracar.eshop.dto.cart.AddItemToCartRequestDto;
import com.omeracar.eshop.dto.cart.CartResponseDto;

public interface ICartService {

    CartResponseDto getCartForCurrentUser();

    CartResponseDto addItemToCart(AddItemToCartRequestDto addItemDto);

    CartResponseDto updateCartItemQuantity(Long cartItemId, int quantity);

    CartResponseDto removeCartItem(Long cartItemId);

    CartResponseDto clearCart();


}
