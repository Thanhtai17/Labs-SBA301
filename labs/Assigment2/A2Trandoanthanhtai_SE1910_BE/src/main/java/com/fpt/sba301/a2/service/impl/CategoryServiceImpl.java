/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.service.impl;

import com.fpt.sba301.a2.dto.CategoryDTO;
import com.fpt.sba301.a2.entity.Category;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.CategoryRepository;
import com.fpt.sba301.a2.repository.NewsArticleRepository;
import com.fpt.sba301.a2.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, NewsArticleRepository newsArticleRepository) {
        this.categoryRepository = categoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Override
    public List<CategoryDTO> getAllCategories(String keyword, Boolean activeOnly) {
        List<Category> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = categoryRepository.findByCategoryNameContainingIgnoreCase(keyword.trim());
        } else if (Boolean.TRUE.equals(activeOnly)) {
            list = categoryRepository.findByActive(true);
        } else {
            list = categoryRepository.findAll();
        }

        if (Boolean.TRUE.equals(activeOnly) && keyword != null && !keyword.trim().isEmpty()) {
            list = list.stream().filter(c -> Boolean.TRUE.equals(c.getActive())).collect(Collectors.toList());
        }

        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public CategoryDTO getCategoryById(Short id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return toDTO(category);
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO request) {
        Category category = new Category();
        category.setCategoryName(request.getCategoryName().trim());
        category.setCategoryDescription(request.getCategoryDescription().trim());
        category.setParentCategoryId(request.getParentCategoryId());
        category.setActive(request.getActive() != null ? request.getActive() : true);

        Category saved = categoryRepository.save(category);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Short id, CategoryDTO request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        category.setCategoryName(request.getCategoryName().trim());
        category.setCategoryDescription(request.getCategoryDescription().trim());
        category.setParentCategoryId(request.getParentCategoryId());
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        Category updated = categoryRepository.save(category);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Short id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with ID: " + id);
        }

        // Rule: The delete action will delete an item in the case this item is not belong to any news articles.
        // If the item is already stored in a news article cannot delete.
        boolean hasArticles = newsArticleRepository.existsByCategory_CategoryId(id);
        if (hasArticles) {
            throw new BusinessConflictException("Cannot delete Category #" + id + " because it is currently used by news articles in the system.");
        }

        categoryRepository.deleteById(id);
    }

    private CategoryDTO toDTO(Category category) {
        return new CategoryDTO(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getCategoryDescription(),
                category.getParentCategoryId(),
                category.getActive()
        );
    }
}

