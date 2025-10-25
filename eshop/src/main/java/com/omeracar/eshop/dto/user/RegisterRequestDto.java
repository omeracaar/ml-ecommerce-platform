package com.omeracar.eshop.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.omeracar.eshop.model.Cart;
import com.omeracar.eshop.model.Order;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class RegisterRequestDto {

    @NotBlank(message = "Kullanıcı adı boş olamaz")
    private String username;

    @NotBlank(message = "E-posta boş olamaz")
    @Email(message = "Geçerli bir e-posta adresi giriniz")
    @Size(max = 100, message = "E-posta en fazla 100 karakter olabilir")
    private String email;

    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 6, max = 100, message = "Şifre 6 ile 100 karakter arasında olmalı")
    private String password;

    //role kısmını kullanmayıp varsayılan olarak user ekliyorum

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;

}
