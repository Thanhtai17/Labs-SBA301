package com.fpt.sba301.a3.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "RoomInformation")
public class RoomInformation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomID")
    private Integer roomId;

    @Column(name = "RoomNumber", nullable = false, length = 50)
    private String roomNumber;

    @Column(name = "RoomDetailDescription", length = 220)
    private String roomDetailDescription;

    @Column(name = "RoomMaxCapacity")
    private Integer roomMaxCapacity;

    @Column(name = "RoomTypeID", nullable = false)
    private Integer roomTypeId;

    @Column(name = "RoomStatus")
    private Byte roomStatus;

    @Column(name = "RoomPricePerDay", precision = 19, scale = 4)
    private BigDecimal roomPricePerDay;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "RoomTypeID", insertable = false, updatable = false)
    private RoomType roomType;

    public RoomInformation() {
    }

    public RoomInformation(Integer roomId, String roomNumber, String roomDetailDescription,
                           Integer roomMaxCapacity, Integer roomTypeId, Byte roomStatus,
                           BigDecimal roomPricePerDay) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomDetailDescription = roomDetailDescription;
        this.roomMaxCapacity = roomMaxCapacity;
        this.roomTypeId = roomTypeId;
        this.roomStatus = roomStatus;
        this.roomPricePerDay = roomPricePerDay;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomDetailDescription() {
        return roomDetailDescription;
    }

    public void setRoomDetailDescription(String roomDetailDescription) {
        this.roomDetailDescription = roomDetailDescription;
    }

    public Integer getRoomMaxCapacity() {
        return roomMaxCapacity;
    }

    public void setRoomMaxCapacity(Integer roomMaxCapacity) {
        this.roomMaxCapacity = roomMaxCapacity;
    }

    public Integer getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(Integer roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public Byte getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(Byte roomStatus) {
        this.roomStatus = roomStatus;
    }

    public BigDecimal getRoomPricePerDay() {
        return roomPricePerDay;
    }

    public void setRoomPricePerDay(BigDecimal roomPricePerDay) {
        this.roomPricePerDay = roomPricePerDay;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
        if (roomType != null) {
            this.roomTypeId = roomType.getRoomTypeId();
        }
    }
}

