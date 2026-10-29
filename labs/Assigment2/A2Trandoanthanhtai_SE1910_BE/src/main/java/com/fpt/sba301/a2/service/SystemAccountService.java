/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.AccountDTO;
import com.fpt.sba301.a2.dto.AccountRequest;
import com.fpt.sba301.a2.dto.LoginRequest;
import com.fpt.sba301.a2.dto.LoginResponse;

import java.util.List;

public interface SystemAccountService {

    LoginResponse login(LoginRequest request);

    List<AccountDTO> getAllAccounts(String keyword);

    AccountDTO getAccountById(Short id);

    AccountDTO createAccount(AccountRequest request);

    AccountDTO updateAccount(Short id, AccountRequest request);

    AccountDTO updateProfile(Short id, AccountRequest request);

    void deleteAccount(Short id);
}

