package com.omeracar.eshop.dto.user;

import com.omeracar.eshop.model.enums.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRoleRequestDto {

    @NotNull(message = "Rol boş olamaz")
    private UserRole role;
}
