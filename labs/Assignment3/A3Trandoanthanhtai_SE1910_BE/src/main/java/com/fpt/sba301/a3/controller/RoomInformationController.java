package com.fpt.sba301.a3.controller;

import com.fpt.sba301.a3.dto.RoomDto;
import com.fpt.sba301.a3.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
public class RoomInformationController {

    @Autowired
    private RoomService roomService;

    /**
     * Requirement: Do not need authentication to view the room information in this system.
     */
    @GetMapping
    public ResponseEntity<List<RoomDto>> getAllRooms(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer roomTypeId,
            @RequestParam(required = false) Byte status,
            @RequestParam(required = false) BigDecimal maxPrice) {
        List<RoomDto> list = roomService.getAllRooms(keyword, roomTypeId, status, maxPrice);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/available")
    public ResponseEntity<List<RoomDto>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getPublicAvailableRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Integer id) {
        try {
            RoomDto dto = roomService.getRoomById(id);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@Valid @RequestBody RoomDto dto) {
        try {
            RoomDto created = roomService.createRoom(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Integer id, @Valid @RequestBody RoomDto dto) {
        try {
            RoomDto updated = roomService.updateRoom(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Requirement:
     * The delete action will delete room information in the case this information is not belong
     * to any renting transaction. If the room information is already stored in a booking detail,
     * just change the status.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Integer id) {
        try {
            Map<String, Object> response = roomService.deleteRoom(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

