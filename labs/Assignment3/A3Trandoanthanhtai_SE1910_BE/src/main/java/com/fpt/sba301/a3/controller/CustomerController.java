/**
 * Project: FUMiniHotelSystem - Assignment 03 (Backend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
package com.fpt.sba301.a3.controller;

import com.fpt.sba301.a3.dto.CustomerDto;
import com.fpt.sba301.a3.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // ==========================================
    // CUSTOMER PROFILE (SELF MANAGEMENT)
    // ==========================================
    @GetMapping("/customer/profile")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            CustomerDto dto = customerService.getProfile(email);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/customer/profile")
    public ResponseEntity<?> updateMyProfile(Authentication authentication, @RequestBody CustomerDto dto) {
        try {
            String email = authentication.getName();
            CustomerDto updated = customerService.updateProfile(email, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ==========================================
    // STAFF: MANAGE CUSTOMERS
    // ==========================================
    @GetMapping("/customers")
    public ResponseEntity<List<CustomerDto>> getAllCustomers(@RequestParam(required = false) String keyword) {
        List<CustomerDto> list = customerService.getAllCustomers(keyword);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/customers/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable Integer id) {
        try {
            CustomerDto dto = customerService.getCustomerById(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/customers")
    public ResponseEntity<?> createCustomer(@Valid @RequestBody CustomerDto dto) {
        try {
            CustomerDto created = customerService.createCustomer(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Integer id, @Valid @RequestBody CustomerDto dto) {
        try {
            CustomerDto updated = customerService.updateCustomer(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(Map.of("message", "KhÃ¡ch hÃ ng Ä‘Ã£ Ä‘Æ°á»£c chuyá»ƒn tráº¡ng thÃ¡i ngÆ°ng hoáº¡t Ä‘á»™ng (Status = 0)."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

