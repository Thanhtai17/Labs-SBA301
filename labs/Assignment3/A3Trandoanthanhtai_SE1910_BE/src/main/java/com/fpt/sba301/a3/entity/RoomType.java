package com.fpt.sba301.a3.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "RoomType")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RoomTypeID")
    private Integer roomTypeId;

    @Column(name = "RoomTypeName", nullable = false, length = 50)
    private String roomTypeName;

    @Column(name = "TypeDescription", length = 250)
    private String typeDescription;

    @Column(name = "TypeNote", length = 250)
    private String typeNote;

    public RoomType() {
    }

    public RoomType(Integer roomTypeId, String roomTypeName, String typeDescription, String typeNote) {
        this.roomTypeId = roomTypeId;
        this.roomTypeName = roomTypeName;
        this.typeDescription = typeDescription;
        this.typeNote = typeNote;
    }

    public Integer getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(Integer roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public String getRoomTypeName() {
        return roomTypeName;
    }

    public void setRoomTypeName(String roomTypeName) {
        this.roomTypeName = roomTypeName;
    }

    public String getTypeDescription() {
        return typeDescription;
    }

    public void setTypeDescription(String typeDescription) {
        this.typeDescription = typeDescription;
    }

    public String getTypeNote() {
        return typeNote;
    }

    public void setTypeNote(String typeNote) {
        this.typeNote = typeNote;
    }
}

