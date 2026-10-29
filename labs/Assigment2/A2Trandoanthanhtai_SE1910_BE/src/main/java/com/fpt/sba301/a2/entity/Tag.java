/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Tag")
public class Tag {

    @Id
    @Column(name = "TagID")
    private Integer tagId;

    @Column(name = "TagName", length = 50)
    private String tagName;

    @Column(name = "Note", length = 400)
    private String note;

    public Tag() {
    }

    public Tag(Integer tagId, String tagName, String note) {
        this.tagId = tagId;
        this.tagName = tagName;
        this.note = note;
    }

    public Integer getTagId() {
        return tagId;
    }

    public void setTagId(Integer tagId) {
        this.tagId = tagId;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}

