/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.dto;

public class AccountDTO {
    private Short accountId;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
    private String accountPassword;

    public AccountDTO() {
    }

    public AccountDTO(Short accountId, String accountName, String accountEmail, Integer accountRole, String accountPassword) {
        this.accountId = accountId;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        this.accountPassword = accountPassword;
    }

    public Short getAccountId() {
        return accountId;
    }

    public void setAccountId(Short accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }
}

