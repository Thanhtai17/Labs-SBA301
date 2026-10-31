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

