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

import com.fpt.sba301.a2.dto.NewsArticleDTO;
import com.fpt.sba301.a2.dto.NewsArticleRequest;
import com.fpt.sba301.a2.dto.TagDTO;
import com.fpt.sba301.a2.entity.Category;
import com.fpt.sba301.a2.entity.NewsArticle;
import com.fpt.sba301.a2.entity.SystemAccount;
import com.fpt.sba301.a2.entity.Tag;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.exception.ResourceNotFoundException;
import com.fpt.sba301.a2.repository.CategoryRepository;
import com.fpt.sba301.a2.repository.NewsArticleRepository;
import com.fpt.sba301.a2.repository.SystemAccountRepository;
import com.fpt.sba301.a2.repository.TagRepository;
import com.fpt.sba301.a2.service.NewsArticleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsArticleServiceImpl implements NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    public NewsArticleServiceImpl(
            NewsArticleRepository newsArticleRepository,
            CategoryRepository categoryRepository,
            SystemAccountRepository accountRepository,
            TagRepository tagRepository
    ) {
        this.newsArticleRepository = newsArticleRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
    }

    @Override
    public List<NewsArticleDTO> searchArticles(String keyword, Short categoryId, Integer tagId, Boolean status, Short createdById) {
        String cleanKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
        List<NewsArticle> list = newsArticleRepository.searchArticles(cleanKeyword, categoryId, tagId, status, createdById);
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public NewsArticleDTO getArticleById(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        return toDTO(article);
    }

    @Override
    @Transactional
    public NewsArticleDTO createArticle(NewsArticleRequest request) {
        String articleId = request.getNewsArticleId();
        if (articleId != null && !articleId.trim().isEmpty()) {
            articleId = articleId.trim();
            if (newsArticleRepository.existsById(articleId)) {
                throw new BusinessConflictException("News article with ID '" + articleId + "' already exists");
            }
        } else {
            articleId = generateNextArticleId();
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        SystemAccount creator = null;
        if (request.getAccountId() != null) {
            creator = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + request.getAccountId()));
        }

        NewsArticle article = new NewsArticle();
        article.setNewsArticleId(articleId);
        article.setNewsTitle(request.getNewsTitle().trim());
        article.setHeadline(request.getHeadline().trim());
        article.setNewsContent(request.getNewsContent());
        article.setNewsSource(request.getNewsSource());
        article.setCategory(category);
        article.setNewsStatus(request.getNewsStatus() != null ? request.getNewsStatus() : true);
        article.setCreatedBy(creator);
        article.setUpdatedBy(creator);
        article.setCreatedDate(LocalDateTime.now());
        article.setModifiedDate(LocalDateTime.now());

        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            article.setTags(new HashSet<>(tags));
        }

        NewsArticle saved = newsArticleRepository.save(article);
        return toDTO(saved);
    }

    @Override
    @Transactional
    public NewsArticleDTO updateArticle(String id, NewsArticleRequest request) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        article.setNewsTitle(request.getNewsTitle().trim());
        article.setHeadline(request.getHeadline().trim());
        article.setNewsContent(request.getNewsContent());
        article.setNewsSource(request.getNewsSource());
        article.setCategory(category);
        if (request.getNewsStatus() != null) {
            article.setNewsStatus(request.getNewsStatus());
        }

        if (request.getAccountId() != null) {
            SystemAccount updater = accountRepository.findById(request.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + request.getAccountId()));
            article.setUpdatedBy(updater);
        }
        article.setModifiedDate(LocalDateTime.now());

        if (request.getTagIds() != null) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            article.setTags(new HashSet<>(tags));
        }

        NewsArticle updated = newsArticleRepository.save(article);
        return toDTO(updated);
    }

    @Override
    @Transactional
    public void deleteArticle(String id) {
        NewsArticle article = newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
        // Remove associations before deleting
        article.getTags().clear();
        newsArticleRepository.delete(article);
    }

    private synchronized String generateNextArticleId() {
        List<NewsArticle> all = newsArticleRepository.findAll();
        long maxNum = 0;
        for (NewsArticle a : all) {
            try {
                long num = Long.parseLong(a.getNewsArticleId().trim());
                if (num > maxNum) {
                    maxNum = num;
                }
            } catch (NumberFormatException ignored) {
            }
        }
        return String.valueOf(maxNum + 1);
    }

    private NewsArticleDTO toDTO(NewsArticle a) {
        NewsArticleDTO dto = new NewsArticleDTO();
        dto.setNewsArticleId(a.getNewsArticleId());
        dto.setNewsTitle(a.getNewsTitle());
        dto.setHeadline(a.getHeadline());
        dto.setCreatedDate(a.getCreatedDate());
        dto.setNewsContent(a.getNewsContent());
        dto.setNewsSource(a.getNewsSource());
        if (a.getCategory() != null) {
            dto.setCategoryId(a.getCategory().getCategoryId());
            dto.setCategoryName(a.getCategory().getCategoryName());
        }
        dto.setNewsStatus(a.getNewsStatus());
        if (a.getCreatedBy() != null) {
            dto.setCreatedById(a.getCreatedBy().getAccountId());
            dto.setCreatedByName(a.getCreatedBy().getAccountName());
        }
        if (a.getUpdatedBy() != null) {
            dto.setUpdatedById(a.getUpdatedBy().getAccountId());
            dto.setUpdatedByName(a.getUpdatedBy().getAccountName());
        }
        dto.setModifiedDate(a.getModifiedDate());

        if (a.getTags() != null) {
            List<TagDTO> tagDTOs = a.getTags().stream()
                    .map(t -> new TagDTO(t.getTagId(), t.getTagName(), t.getNote()))
                    .sorted(Comparator.comparing(TagDTO::getTagId))
                    .collect(Collectors.toList());
            dto.setTags(tagDTOs);
        }
        return dto;
    }
}

