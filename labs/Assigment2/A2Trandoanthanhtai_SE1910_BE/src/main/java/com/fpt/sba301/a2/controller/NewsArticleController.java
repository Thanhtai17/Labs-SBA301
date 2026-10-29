/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.controller;

import com.fpt.sba301.a2.dto.NewsArticleDTO;
import com.fpt.sba301.a2.dto.NewsArticleRequest;
import com.fpt.sba301.a2.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    public NewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @GetMapping
    public ResponseEntity<List<NewsArticleDTO>> searchArticles(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "categoryId", required = false) Short categoryId,
            @RequestParam(value = "tagId", required = false) Integer tagId,
            @RequestParam(value = "status", required = false) Boolean status,
            @RequestParam(value = "createdById", required = false) Short createdById
    ) {
        List<NewsArticleDTO> list = newsArticleService.searchArticles(keyword, categoryId, tagId, status, createdById);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> getArticleById(@PathVariable("id") String id) {
        NewsArticleDTO article = newsArticleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    @PostMapping
    public ResponseEntity<NewsArticleDTO> createArticle(@Valid @RequestBody NewsArticleRequest request) {
        NewsArticleDTO created = newsArticleService.createArticle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleDTO> updateArticle(
            @PathVariable("id") String id,
            @Valid @RequestBody NewsArticleRequest request
    ) {
        NewsArticleDTO updated = newsArticleService.updateArticle(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable("id") String id) {
        newsArticleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }
}

