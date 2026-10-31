package com.fpt.sba301.a3.repository;

import com.fpt.sba301.a3.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Optional<Customer> findByEmailAddress(String emailAddress);

    boolean existsByEmailAddress(String emailAddress);

    @Query("SELECT c FROM Customer c WHERE " +
           "(:keyword IS NULL OR LOWER(c.customerFullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.telephone LIKE CONCAT('%', :keyword, '%'))")
    List<Customer> searchCustomers(@Param("keyword") String keyword);
}

