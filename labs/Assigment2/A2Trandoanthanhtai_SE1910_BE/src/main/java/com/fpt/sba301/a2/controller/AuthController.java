/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.controller;

import com.fpt.sba301.a2.dto.LoginRequest;
import com.fpt.sba301.a2.dto.LoginResponse;
import com.fpt.sba301.a2.service.SystemAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final SystemAccountService accountService;

    public AuthController(SystemAccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = accountService.login(request);
        return ResponseEntity.ok(response);
    }
}

