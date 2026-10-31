/**
 * Project: FUMiniHotelSystem - Assignment 03 (Backend)
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 31, 2026
 */
package com.fpt.sba301.a3.repository;

import com.fpt.sba301.a3.entity.BookingDetail;
import com.fpt.sba301.a3.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {

    boolean existsById_RoomId(Integer roomId);

    List<BookingDetail> findById_BookingReservationId(Integer bookingReservationId);
}

