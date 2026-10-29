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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class SystemAccountController {

    private final SystemAccountService accountService;

    public SystemAccountController(SystemAccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAllAccounts(@RequestParam(value = "keyword", required = false) String keyword) {
        List<AccountDTO> list = accountService.getAllAccounts(keyword);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccountById(@PathVariable("id") Short id) {
        AccountDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(@Valid @RequestBody AccountRequest request) {
        AccountDTO created = accountService.createAccount(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> updateAccount(
            @PathVariable("id") Short id,
            @Valid @RequestBody AccountRequest request
    ) {
        AccountDTO updated = accountService.updateAccount(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable("id") Short id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}

