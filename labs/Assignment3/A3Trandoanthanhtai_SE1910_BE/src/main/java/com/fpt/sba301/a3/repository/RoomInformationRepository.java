package com.fpt.sba301.a3.repository;

import com.fpt.sba301.a3.entity.RoomInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomInformationRepository extends JpaRepository<RoomInformation, Integer> {

    List<RoomInformation> findByRoomStatus(Byte roomStatus);

    @Query("SELECT r FROM RoomInformation r WHERE " +
           "(:keyword IS NULL OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.roomDetailDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:roomTypeId IS NULL OR r.roomTypeId = :roomTypeId) AND " +
           "(:status IS NULL OR r.roomStatus = :status) AND " +
           "(:maxPrice IS NULL OR r.roomPricePerDay <= :maxPrice)")
    List<RoomInformation> searchRooms(@Param("keyword") String keyword,
                                      @Param("roomTypeId") Integer roomTypeId,
                                      @Param("status") Byte status,
                                      @Param("maxPrice") BigDecimal maxPrice);
}

