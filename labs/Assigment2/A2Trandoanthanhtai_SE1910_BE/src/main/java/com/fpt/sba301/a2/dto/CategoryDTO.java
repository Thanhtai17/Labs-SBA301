/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDTO {

    private Short categoryId;

    @NotBlank(message = "Category name is required")
    @Size(max = 100, message = "Category name must not exceed 100 characters")
    private String categoryName;

    @NotBlank(message = "Category description is required")
    @Size(max = 250, message = "Category description must not exceed 250 characters")
    private String categoryDescription;

    private Short parentCategoryId;
    private Boolean active;

    public CategoryDTO() {
    }

    public CategoryDTO(Short categoryId, String categoryName, String categoryDescription, Short parentCategoryId, Boolean active) {
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

