package com.omeracar.eshop.controller.impl;

import com.omeracar.eshop.controller.IRestCartController;
import com.omeracar.eshop.controller.RestBaseController;
import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.dto.cart.AddItemToCartRequestDto;
import com.omeracar.eshop.dto.cart.CartResponseDto;
import com.omeracar.eshop.service.impl.CartServiceImpl;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rest/api/cart")
@Validated
public class RestCartControllerImpl extends RestBaseController implements IRestCartController {

    //endpoint adları duzenlenicek


    @Autowired
    private CartServiceImpl cartService;

    @Override
    @GetMapping
    public ResponseEntity<RootEntity<CartResponseDto>> getCart() {
        CartResponseDto cartDto=cartService.getCartForCurrentUser();
        return ok(cartDto);
    }

    @Override
    @PostMapping("/items")
    public ResponseEntity<RootEntity<CartResponseDto>> addItemToCart(
            @Valid @RequestBody AddItemToCartRequestDto addItemDto) {
        CartResponseDto updatedCart=cartService.addItemToCart(addItemDto);
        return ok(updatedCart);
    }

    @Override
    @GetMapping("/items/{cartItemId}")
    public ResponseEntity<RootEntity<CartResponseDto>> updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam @Min(value = 1,message = "miktar en az 1 olmali") Integer quantity) {
        CartResponseDto updatedCart=cartService.updateCartItemQuantity(cartItemId,quantity);
        return ok(updatedCart);
    }

    @Override
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<RootEntity<CartResponseDto>> removeItemFromCart(
            @PathVariable Long cartItemId) {
        CartResponseDto updatedCart=cartService.removeCartItem(cartItemId);
        return ok(updatedCart);
    }

    @Override
    @DeleteMapping
    public ResponseEntity<RootEntity<CartResponseDto>> clearCart() {
        CartResponseDto clearedCart=cartService.clearCart();
        return ok(clearedCart);
    }
}
