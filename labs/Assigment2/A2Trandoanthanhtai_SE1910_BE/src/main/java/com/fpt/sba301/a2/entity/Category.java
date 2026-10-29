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
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Short categoryId;

    @Column(name = "CategoryName", nullable = false, length = 100)
    private String categoryName;

    // Database column has exact spelling: CategoryDesciption
    @Column(name = "CategoryDesciption", nullable = false, length = 250)
    private String categoryDescription;

    @Column(name = "ParentCategoryID")
    private Short parentCategoryId;

    @Column(name = "IsActive")
    private Boolean active;

    public Category() {
    }

    public Category(Short categoryId, String categoryName, String categoryDescription, Short parentCategoryId, Boolean active) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
        this.parentCategoryId = parentCategoryId;
        this.active = active;
    }

    public Short getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Short categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryDescription() {
        return categoryDescription;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    public Short getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(Short parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}

