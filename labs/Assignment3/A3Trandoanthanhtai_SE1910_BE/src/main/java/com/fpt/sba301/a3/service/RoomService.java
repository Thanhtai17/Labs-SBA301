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

import com.fpt.sba301.a3.dto.RoomDto;
import com.fpt.sba301.a3.entity.RoomInformation;
import com.fpt.sba301.a3.entity.RoomType;
import com.fpt.sba301.a3.repository.BookingDetailRepository;
import com.fpt.sba301.a3.repository.RoomInformationRepository;
import com.fpt.sba301.a3.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomInformationRepository roomRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    public List<RoomDto> getAllRooms(String keyword, Integer roomTypeId, Byte status, BigDecimal maxPrice) {
        String kw = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        List<RoomInformation> rooms = roomRepository.searchRooms(kw, roomTypeId, status, maxPrice);
        return rooms.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<RoomDto> getPublicAvailableRooms() {
        // Public viewing for active rooms only
        List<RoomInformation> rooms = roomRepository.findByRoomStatus((byte) 1);
        return rooms.stream().map(this::toDto).collect(Collectors.toList());
    }

    public RoomDto getRoomById(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with id: " + id));
        return toDto(room);
    }

    @Transactional
    public RoomDto createRoom(RoomDto dto) {
        RoomType roomType = roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new IllegalArgumentException("RoomType not found with id: " + dto.getRoomTypeId()));

        RoomInformation room = new RoomInformation();
        room.setRoomNumber(dto.getRoomNumber().trim());
        room.setRoomDetailDescription(dto.getRoomDetailDescription());
        room.setRoomMaxCapacity(dto.getRoomMaxCapacity());
        room.setRoomTypeId(roomType.getRoomTypeId());
        room.setRoomStatus(dto.getRoomStatus() != null ? dto.getRoomStatus() : (byte) 1);
        room.setRoomPricePerDay(dto.getRoomPricePerDay());

        RoomInformation saved = roomRepository.save(room);
        saved.setRoomType(roomType);
        return toDto(saved);
    }

    @Transactional
    public RoomDto updateRoom(Integer id, RoomDto dto) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with id: " + id));

        RoomType roomType = roomTypeRepository.findById(dto.getRoomTypeId())
                .orElseThrow(() -> new IllegalArgumentException("RoomType not found with id: " + dto.getRoomTypeId()));

        room.setRoomNumber(dto.getRoomNumber().trim());
        room.setRoomDetailDescription(dto.getRoomDetailDescription());
        room.setRoomMaxCapacity(dto.getRoomMaxCapacity());
        room.setRoomTypeId(roomType.getRoomTypeId());
        if (dto.getRoomStatus() != null) {
            room.setRoomStatus(dto.getRoomStatus());
        }
        room.setRoomPricePerDay(dto.getRoomPricePerDay());

        RoomInformation saved = roomRepository.save(room);
        saved.setRoomType(roomType);
        return toDto(saved);
    }

    /**
     * Requirement from Assignment:
     * "The delete action will delete room information in the case this information is not belong
     *  to any renting transaction. If the room information is already stored in a booking detail,
     *  just change the status."
     */
    @Transactional
    public Map<String, Object> deleteRoom(Integer id) {
        RoomInformation room = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with id: " + id));

        boolean existsInBooking = bookingDetailRepository.existsById_RoomId(id);
        Map<String, Object> result = new HashMap<>();

        if (existsInBooking) {
            // Soft delete: Change status to Inactive (0)
            room.setRoomStatus((byte) 0);
            roomRepository.save(room);
            result.put("action", "STATUS_DEACTIVATED");
            result.put("message", "PhÃ²ng [" + room.getRoomNumber() + "] Ä‘Ã£ tá»«ng cÃ³ giao dá»‹ch Ä‘áº·t phÃ²ng nÃªn há»‡ thá»‘ng chá»‰ chuyá»ƒn tráº¡ng thÃ¡i sang ngÆ°ng hoáº¡t Ä‘á»™ng (RoomStatus = 0) theo Ä‘Ãºng yÃªu cáº§u Ä‘á» bÃ i.");
        } else {
            // Hard delete: Not in any renting transaction
            roomRepository.delete(room);
            result.put("action", "HARD_DELETED");
            result.put("message", "PhÃ²ng [" + room.getRoomNumber() + "] chÆ°a tá»«ng cÃ³ giao dá»‹ch Ä‘áº·t phÃ²ng nÃ o nÃªn Ä‘Ã£ Ä‘Æ°á»£c xÃ³a hoÃ n toÃ n khá»i cÆ¡ sá»Ÿ dá»¯ liá»‡u.");
        }
        return result;
    }

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    private RoomDto toDto(RoomInformation r) {
        String typeName = (r.getRoomType() != null) ? r.getRoomType().getRoomTypeName() : null;
        return new RoomDto(
                r.getRoomId(),
                r.getRoomNumber(),
                r.getRoomDetailDescription(),
                r.getRoomMaxCapacity(),
                r.getRoomTypeId(),
                typeName,
                r.getRoomStatus(),
                r.getRoomPricePerDay()
        );
    }
}

