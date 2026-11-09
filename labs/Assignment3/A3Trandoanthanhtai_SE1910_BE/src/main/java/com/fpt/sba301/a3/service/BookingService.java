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

import com.fpt.sba301.a3.dto.BookingCreateRequest;
import com.fpt.sba301.a3.dto.BookingDetailRequest;
import com.fpt.sba301.a3.dto.BookingDetailResponseDto;
import com.fpt.sba301.a3.dto.BookingResponseDto;
import com.fpt.sba301.a3.entity.BookingDetail;
import com.fpt.sba301.a3.entity.BookingDetailId;
import com.fpt.sba301.a3.entity.BookingReservation;
import com.fpt.sba301.a3.entity.Customer;
import com.fpt.sba301.a3.entity.RoomInformation;
import com.fpt.sba301.a3.repository.BookingDetailRepository;
import com.fpt.sba301.a3.repository.BookingReservationRepository;
import com.fpt.sba301.a3.repository.CustomerRepository;
import com.fpt.sba301.a3.repository.RoomInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingReservationRepository bookingReservationRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoomInformationRepository roomRepository;

    public List<BookingResponseDto> getAllBookings() {
        return bookingReservationRepository.findAllByOrderByBookingDateDesc()
                .stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    public List<BookingResponseDto> getMyBookings(String customerEmail) {
        Customer customer = customerRepository.findByEmailAddress(customerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Customer profile not found"));
        return bookingReservationRepository.findByCustomerIdOrderByBookingDateDesc(customer.getCustomerId())
                .stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    public BookingResponseDto getBookingById(Integer id) {
        BookingReservation res = bookingReservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking reservation not found with id: " + id));
        return toResponseDto(res);
    }

    @Transactional
    public BookingResponseDto createBooking(String userEmail, String userRole, BookingCreateRequest req) {
        Customer customer;
        if ("STAFF".equalsIgnoreCase(userRole)) {
            if (req.getCustomerId() == null) {
                throw new IllegalArgumentException("Customer ID is required when booking as Staff");
            }
            customer = customerRepository.findById(req.getCustomerId())
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + req.getCustomerId()));
        } else {
            customer = customerRepository.findByEmailAddress(userEmail)
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found with email: " + userEmail));
        }

        if (req.getRoomDetails() == null || req.getRoomDetails().isEmpty()) {
            throw new IllegalArgumentException("At least one room must be selected for reservation");
        }

        // Generate next BookingReservationID
        Integer nextId = bookingReservationRepository.findMaxId() + 1;

        BookingReservation reservation = new BookingReservation();
        reservation.setBookingReservationId(nextId);
        reservation.setBookingDate(LocalDate.now());
        reservation.setCustomerId(customer.getCustomerId());
        reservation.setCustomer(customer);
        // Trạng thái ban đầu: Customer đặt phòng mặc định là 3 (Chờ duyệt / Pending).
        // Khi Staff duyệt thì mới chuyển sang 1 (Đã xác nhận).
        byte initialStatus = "STAFF".equalsIgnoreCase(userRole) ? (byte) 1 : (byte) 3;
        reservation.setBookingStatus(initialStatus);

        BigDecimal calculatedTotalPrice = BigDecimal.ZERO;
        List<BookingDetail> details = new ArrayList<>();

        for (BookingDetailRequest item : req.getRoomDetails()) {
            RoomInformation room = roomRepository.findById(item.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found with id: " + item.getRoomId()));

            if (item.getStartDate() == null || item.getEndDate() == null) {
                throw new IllegalArgumentException("Start date and end date are required for each room");
            }
            if (item.getEndDate().isBefore(item.getStartDate())) {
                throw new IllegalArgumentException("End date cannot be earlier than start date");
            }

            long days = ChronoUnit.DAYS.between(item.getStartDate(), item.getEndDate());
            if (days <= 0) days = 1;

            BigDecimal roomPricePerDay = room.getRoomPricePerDay() != null ? room.getRoomPricePerDay() : BigDecimal.ZERO;
            BigDecimal itemPrice = item.getActualPrice() != null
                    ? item.getActualPrice()
                    : roomPricePerDay.multiply(BigDecimal.valueOf(days));

            BookingDetail detail = new BookingDetail();
            detail.setId(new BookingDetailId(nextId, room.getRoomId()));
            detail.setBookingReservation(reservation);
            detail.setRoomInformation(room);
            detail.setStartDate(item.getStartDate());
            detail.setEndDate(item.getEndDate());
            detail.setActualPrice(itemPrice);

            details.add(detail);
            calculatedTotalPrice = calculatedTotalPrice.add(itemPrice);
        }

        reservation.setTotalPrice(calculatedTotalPrice);
        reservation.setBookingDetails(details);

        BookingReservation saved = bookingReservationRepository.save(reservation);
        return toResponseDto(saved);
    }

    @Transactional
    public BookingResponseDto updateBookingStatus(Integer id, Byte newStatus) {
        BookingReservation res = bookingReservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking reservation not found with id: " + id));

        // Logic nghiệp vụ: Đơn đã hoàn tất (status = 2) thì không đổi trạng thái hủy đơn được nữa
        if (Byte.valueOf((byte) 2).equals(res.getBookingStatus()) && Byte.valueOf((byte) 0).equals(newStatus)) {
            throw new IllegalArgumentException("Đơn đặt phòng đã hoàn tất, không thể đổi trạng thái hủy đơn!");
        }

        res.setBookingStatus(newStatus);
        BookingReservation saved = bookingReservationRepository.save(res);
        return toResponseDto(saved);
    }

    private BookingResponseDto toResponseDto(BookingReservation res) {
        String custName = res.getCustomer() != null ? res.getCustomer().getCustomerFullName() : "N/A";
        String custEmail = res.getCustomer() != null ? res.getCustomer().getEmailAddress() : "N/A";

        List<BookingDetailResponseDto> detailDtos = new ArrayList<>();
        if (res.getBookingDetails() != null) {
            for (BookingDetail d : res.getBookingDetails()) {
                String roomNum = d.getRoomInformation() != null ? d.getRoomInformation().getRoomNumber() : "N/A";
                String typeName = (d.getRoomInformation() != null && d.getRoomInformation().getRoomType() != null)
                        ? d.getRoomInformation().getRoomType().getRoomTypeName() : "N/A";

                detailDtos.add(new BookingDetailResponseDto(
                        d.getId().getRoomId(),
                        roomNum,
                        typeName,
                        d.getStartDate(),
                        d.getEndDate(),
                        d.getActualPrice()
                ));
            }
        }

        return new BookingResponseDto(
                res.getBookingReservationId(),
                res.getBookingDate(),
                res.getTotalPrice(),
                res.getCustomerId(),
                custName,
                custEmail,
                res.getBookingStatus(),
                detailDtos
        );
    }
}
