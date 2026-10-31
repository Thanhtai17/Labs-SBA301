/**
 * Project: FUMiniHotelSystem - Assignment 03 (Backend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
package com.fpt.sba301.a3.service;

import com.fpt.sba301.a3.config.JwtTokenProvider;
import com.fpt.sba301.a3.dto.AuthRequest;
import com.fpt.sba301.a3.dto.AuthResponse;
import com.fpt.sba301.a3.dto.RegisterRequest;
import com.fpt.sba301.a3.entity.Customer;
import com.fpt.sba301.a3.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Value("${hotel.staff.email}")
    private String staffEmail;

    @Value("${hotel.staff.password}")
    private String staffPassword;

    @Value("${hotel.staff.fullName:Hotel Administrator}")
    private String staffFullName;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().trim();
        String password = request.getPassword().trim();

        // 1. Check Staff account from application.properties
        if (staffEmail != null && staffEmail.equalsIgnoreCase(email)) {
            if (staffPassword.equals(password)) {
                String token = tokenProvider.generateToken(email, "STAFF", null, staffFullName);
                return new AuthResponse(token, email, "STAFF", staffFullName, null);
            } else {
                throw new IllegalArgumentException("Invalid email or password");
            }
        }

        // 2. Check Customer account in Database
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!password.equals(customer.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new IllegalStateException("Your account has been deactivated. Please contact hotel staff.");
        }

        String fullName = customer.getCustomerFullName() != null ? customer.getCustomerFullName() : "Customer";
        String token = tokenProvider.generateToken(email, "CUSTOMER", customer.getCustomerId(), fullName);
        return new AuthResponse(token, email, "CUSTOMER", fullName, customer.getCustomerId());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmailAddress().trim();

        if (staffEmail != null && staffEmail.equalsIgnoreCase(email)) {
            throw new IllegalArgumentException("Cannot register using staff email address");
        }

        if (customerRepository.existsByEmailAddress(email)) {
            throw new IllegalArgumentException("Email address is already registered");
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone() != null ? request.getTelephone().trim() : null);
        customer.setEmailAddress(email);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus((byte) 1); // 1 = Active
        customer.setPassword(request.getPassword().trim());

        customer = customerRepository.save(customer);

        String token = tokenProvider.generateToken(email, "CUSTOMER", customer.getCustomerId(), customer.getCustomerFullName());
        return new AuthResponse(token, email, "CUSTOMER", customer.getCustomerFullName(), customer.getCustomerId());
    }
}

