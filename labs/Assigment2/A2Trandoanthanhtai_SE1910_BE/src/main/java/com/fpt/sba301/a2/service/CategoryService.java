/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.service;

import com.fpt.sba301.a2.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {

    List<CategoryDTO> getAllCategories(String keyword, Boolean activeOnly);

    CategoryDTO getCategoryById(Short id);

    CategoryDTO createCategory(CategoryDTO request);

    CategoryDTO updateCategory(Short id, CategoryDTO request);

    void deleteCategory(Short id);
}

