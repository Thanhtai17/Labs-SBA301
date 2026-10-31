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

import com.fpt.sba301.a3.dto.CustomerDto;
import com.fpt.sba301.a3.entity.Customer;
import com.fpt.sba301.a3.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<CustomerDto> getAllCustomers(String keyword) {
        List<Customer> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = customerRepository.searchCustomers(keyword.trim());
        } else {
            list = customerRepository.findAll();
        }
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CustomerDto getCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        return toDto(customer);
    }

    public CustomerDto getProfile(String email) {
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found for email: " + email));
        return toDto(customer);
    }

    @Transactional
    public CustomerDto updateProfile(String email, CustomerDto dto) {
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found for email: " + email));

        if (dto.getCustomerFullName() != null) {
            customer.setCustomerFullName(dto.getCustomerFullName().trim());
        }
        if (dto.getTelephone() != null) {
            customer.setTelephone(dto.getTelephone().trim());
        }
        if (dto.getCustomerBirthday() != null) {
            customer.setCustomerBirthday(dto.getCustomerBirthday());
        }
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            customer.setPassword(dto.getPassword().trim());
        }

        Customer updated = customerRepository.save(customer);
        return toDto(updated);
    }

    @Transactional
    public CustomerDto createCustomer(CustomerDto dto) {
        if (customerRepository.existsByEmailAddress(dto.getEmailAddress())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmailAddress());
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(dto.getCustomerFullName());
        customer.setTelephone(dto.getTelephone());
        customer.setEmailAddress(dto.getEmailAddress());
        customer.setCustomerBirthday(dto.getCustomerBirthday());
        customer.setCustomerStatus(dto.getCustomerStatus() != null ? dto.getCustomerStatus() : (byte) 1);
        customer.setPassword(dto.getPassword() != null ? dto.getPassword() : "123456");

        Customer saved = customerRepository.save(customer);
        return toDto(saved);
    }

    @Transactional
    public CustomerDto updateCustomer(Integer id, CustomerDto dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));

        if (dto.getEmailAddress() != null && !dto.getEmailAddress().equalsIgnoreCase(customer.getEmailAddress())) {
            if (customerRepository.existsByEmailAddress(dto.getEmailAddress())) {
                throw new IllegalArgumentException("Email already exists: " + dto.getEmailAddress());
            }
            customer.setEmailAddress(dto.getEmailAddress());
        }

        if (dto.getCustomerFullName() != null) customer.setCustomerFullName(dto.getCustomerFullName());
        if (dto.getTelephone() != null) customer.setTelephone(dto.getTelephone());
        if (dto.getCustomerBirthday() != null) customer.setCustomerBirthday(dto.getCustomerBirthday());
        if (dto.getCustomerStatus() != null) customer.setCustomerStatus(dto.getCustomerStatus());
        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) customer.setPassword(dto.getPassword().trim());

        Customer updated = customerRepository.save(customer);
        return toDto(updated);
    }

    @Transactional
    public void deleteCustomer(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
        // Soft-delete customer by setting status to 0
        customer.setCustomerStatus((byte) 0);
        customerRepository.save(customer);
    }

    private CustomerDto toDto(Customer c) {
        return new CustomerDto(
                c.getCustomerId(),
                c.getCustomerFullName(),
                c.getTelephone(),
                c.getEmailAddress(),
                c.getCustomerBirthday(),
                c.getCustomerStatus(),
                c.getPassword()
        );
    }
}

