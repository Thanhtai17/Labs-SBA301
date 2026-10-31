/**
 * Project: FUMiniHotelSystem - Assignment 03 (Backend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
package com.fpt.sba301.a3.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class BookingCreateRequest {

    private Integer customerId; // optional if customer is authenticated via JWT

    @NotEmpty(message = "At least one room must be selected for booking")
    @Valid
    private List<BookingDetailRequest> roomDetails;

    public BookingCreateRequest() {
    }

    public BookingCreateRequest(Integer customerId, List<BookingDetailRequest> roomDetails) {
        this.customerId = customerId;
        this.roomDetails = roomDetails;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public List<BookingDetailRequest> getRoomDetails() {
        return roomDetails;
    }

    public void setRoomDetails(List<BookingDetailRequest> roomDetails) {
        this.roomDetails = roomDetails;
    }
}

