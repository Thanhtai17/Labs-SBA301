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

import com.fpt.sba301.a2.dto.AccountDTO;
import com.fpt.sba301.a2.dto.AccountRequest;
import com.fpt.sba301.a2.service.SystemAccountService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private final SystemAccountService accountService;

    public ProfileController(SystemAccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getProfile(@PathVariable("id") Short id) {
        AccountDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> updateProfile(
            @PathVariable("id") Short id,
            @Valid @RequestBody AccountRequest request
    ) {
        AccountDTO updated = accountService.updateProfile(id, request);
        return ResponseEntity.ok(updated);
    }
}

