/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.service.impl;

import com.fpt.sba301.a2.dto.AccountDTO;
import com.fpt.sba301.a2.dto.AccountRequest;
import com.fpt.sba301.a2.dto.LoginRequest;
import com.fpt.sba301.a2.dto.LoginResponse;
import com.fpt.sba301.a2.entity.SystemAccount;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.NewsArticleRepository;
import com.fpt.sba301.a2.repository.SystemAccountRepository;
import com.fpt.sba301.a2.service.SystemAccountService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SystemAccountServiceImpl implements SystemAccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    public SystemAccountServiceImpl(SystemAccountRepository accountRepository, NewsArticleRepository newsArticleRepository) {
        this.accountRepository = accountRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        SystemAccount account = accountRepository.findByAccountEmail(request.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Account with email '" + request.getEmail() + "' not found"));

        if (!account.getAccountPassword().equals(request.getPassword().trim())) {
            throw new BusinessConflictException("Invalid email or password");
        }

        return new LoginResponse(
                account.getAccountId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole()
        );
    }

    @Override
    public List<AccountDTO> getAllAccounts(String keyword) {
        List<SystemAccount> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            String term = keyword.trim();
            list = accountRepository.findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(term, term);
        } else {
            list = accountRepository.findAll();
        }
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public AccountDTO getAccountById(Short id) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));
        return toDTO(account);
    }

    @Override
    @Transactional
    public AccountDTO createAccount(AccountRequest request) {
        if (accountRepository.existsByAccountEmail(request.getAccountEmail().trim())) {
            throw new BusinessConflictException("Account email '" + request.getAccountEmail() + "' already exists");
        }

        SystemAccount account = new SystemAccount();
        if (request.getAccountId() != null) {
            if (accountRepository.existsById(request.getAccountId())) {
                throw new BusinessConflictException("Account ID " + request.getAccountId() + " already exists");
            }
            account.setAccountId(request.getAccountId());
        } else {
            short maxId = accountRepository.findMaxAccountId();
            account.setAccountId((short) (maxId + 1));
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(request.getAccountEmail().trim());
        account.setAccountRole(request.getAccountRole());
        account.setAccountPassword(request.getAccountPassword() != null ? request.getAccountPassword().trim() : "@1");

        SystemAccount saved = accountRepository.save(account);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public AccountDTO updateAccount(Short id, AccountRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        // Check if email changed and is taken by another account
        String newEmail = request.getAccountEmail().trim();
        if (!account.getAccountEmail().equalsIgnoreCase(newEmail)) {
            accountRepository.findByAccountEmail(newEmail).ifPresent(other -> {
                if (!other.getAccountId().equals(id)) {
                    throw new BusinessConflictException("Email '" + newEmail + "' is already in use by another account");
                }
            });
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(newEmail);
        if (request.getAccountRole() != null) {
            account.setAccountRole(request.getAccountRole());
        }
        if (request.getAccountPassword() != null && !request.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(request.getAccountPassword().trim());
        }

        SystemAccount updated = accountRepository.save(account);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public AccountDTO updateProfile(Short id, AccountRequest request) {
        SystemAccount account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));

        String newEmail = request.getAccountEmail().trim();
        if (!account.getAccountEmail().equalsIgnoreCase(newEmail)) {
            accountRepository.findByAccountEmail(newEmail).ifPresent(other -> {
                if (!other.getAccountId().equals(id)) {
                    throw new BusinessConflictException("Email '" + newEmail + "' is already in use by another account");
                }
            });
        }

        account.setAccountName(request.getAccountName().trim());
        account.setAccountEmail(newEmail);
        if (request.getAccountPassword() != null && !request.getAccountPassword().trim().isEmpty()) {
            account.setAccountPassword(request.getAccountPassword().trim());
        }

        SystemAccount updated = accountRepository.save(account);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteAccount(Short id) {
        if (!accountRepository.existsById(id)) {
            throw new ResourceNotFoundException("Account not found with ID: " + id);
        }

        // Rule: the delete action will delete an account in the case this account is not belong to any news articles (created),
        // if the account is already created any news article, cannot delete.
        boolean hasCreatedNews = newsArticleRepository.existsByCreatedBy_AccountId(id);
        if (hasCreatedNews) {
            throw new BusinessConflictException("Cannot delete account #" + id + " because it has already created news articles in the system.");
        }

        accountRepository.deleteById(id);
    }

    private AccountDTO toDTO(SystemAccount account) {
        return new AccountDTO(
                account.getAccountId(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole(),
                account.getAccountPassword()
        );
    }
}

