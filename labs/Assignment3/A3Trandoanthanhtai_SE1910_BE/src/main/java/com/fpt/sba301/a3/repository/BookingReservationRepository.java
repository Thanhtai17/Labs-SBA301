package com.fpt.sba301.a3.repository;

import com.fpt.sba301.a3.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {

    List<BookingReservation> findByCustomerIdOrderByBookingDateDesc(Integer customerId);

    List<BookingReservation> findAllByOrderByBookingDateDesc();

    @Query("SELECT COALESCE(MAX(b.bookingReservationId), 0) FROM BookingReservation b")
    Integer findMaxId();
}

