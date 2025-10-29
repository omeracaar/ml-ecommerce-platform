package com.omeracar.eshop.controller.impl;

import com.omeracar.eshop.controller.IRestOrderController;
import com.omeracar.eshop.controller.RestBaseController;
import com.omeracar.eshop.controller.RootEntity;
import com.omeracar.eshop.dto.order.OrderResponseDto;
import com.omeracar.eshop.exception.ResourceNotFoundException;
import com.omeracar.eshop.model.enums.OrderStatus;
import com.omeracar.eshop.service.impl.OrderServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/api/orders")
public class RestOrderControllerImpl extends RestBaseController implements IRestOrderController {

    @Autowired
    private OrderServiceImpl orderService;


    @Override
    @PostMapping
    public ResponseEntity<RootEntity<OrderResponseDto>> createOrderFromCart(
            @RequestParam (required = false) String shippingAddress) {
        OrderResponseDto createdOrder=orderService.createOrderFromCart(shippingAddress);
        return created(createdOrder);
    }

    @Override
    @GetMapping("/my")
    public ResponseEntity<RootEntity<List<OrderResponseDto>>> getCurrentUserOrders() {
        List<OrderResponseDto> orders=orderService.getOrdersForCurrentUser();
        return ok(orders);
    }

    @Override
    @GetMapping("/my/{orderId}")
    public ResponseEntity<RootEntity<OrderResponseDto>> getCurrentUserOrderById(
            @PathVariable(name = "orderId") Long orderId) {
        OrderResponseDto orderDto=orderService.getOrderByIdForCurrentUser(orderId)
                .orElseThrow(()->new ResourceNotFoundException(orderId+" id li order bulunamadi ya da goruntuleme izniniz yok"));
        return ok(orderDto);
    }

    @Override
    @GetMapping("/admin")
    public ResponseEntity<RootEntity<Page<OrderResponseDto>>> getAllOrders(Pageable pageable) {
        Page<OrderResponseDto> orders=orderService.getAllOrders(pageable);
        return ok(orders);
    }

    @Override
    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<RootEntity<OrderResponseDto>> updateOrderStatus(
            @PathVariable(name = "orderId") Long orderId,
            @RequestParam OrderStatus status) {
        OrderResponseDto updatedOrder=orderService.updateOrderStatus(orderId,status);
        return ok(updatedOrder);
    }
}
