/**
 * Project: FUMiniHotelSystem - Assignment 03 (Backend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
package com.fpt.sba301.a3.controller;

import com.fpt.sba301.a3.dto.BookingCreateRequest;
import com.fpt.sba301.a3.dto.BookingResponseDto;
import com.fpt.sba301.a3.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingReservationController {

    @Autowired
    private BookingService bookingService;

    /**
     * Staff: View all bookings
     */
    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * Customer: View his/her own booking history
     */
    @GetMapping("/my-history")
    public ResponseEntity<?> getMyBookingHistory(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<BookingResponseDto> list = bookingService.getMyBookings(email);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer id) {
        try {
            BookingResponseDto dto = bookingService.getBookingById(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Customer or Staff: Create booking reservation
     */
    @PostMapping
    public ResponseEntity<?> createBooking(Authentication authentication,
                                           @Valid @RequestBody BookingCreateRequest request) {
        try {
            String email = authentication.getName();
            String role = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(a -> a.startsWith("ROLE_"))
                    .map(a -> a.substring(5))
                    .findFirst()
                    .orElse("CUSTOMER");

            BookingResponseDto response = bookingService.createBooking(email, role, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error creating booking: " + e.getMessage()));
        }
    }

    /**
     * Staff or Customer: Change booking status (e.g., 0 = Cancelled, 2 = Completed)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            Object statusObj = body.get("bookingStatus");
            if (statusObj == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "bookingStatus is required"));
            }
            Byte status = Byte.valueOf(statusObj.toString());
            BookingResponseDto updated = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

