/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.repository;

import com.fpt.sba301.a2.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {

    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    boolean existsByAccountEmail(String accountEmail);

    List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String accountName, String accountEmail);

    @Query("SELECT COALESCE(MAX(a.accountId), 0) FROM SystemAccount a")
    short findMaxAccountId();
}

