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

import com.fpt.sba301.a2.dto.NewsArticleDTO;
import com.fpt.sba301.a2.dto.NewsArticleRequest;

import java.util.List;

public interface NewsArticleService {

    List<NewsArticleDTO> searchArticles(String keyword, Short categoryId, Integer tagId, Boolean status, Short createdById);

    NewsArticleDTO getArticleById(String id);

    NewsArticleDTO createArticle(NewsArticleRequest request);

    NewsArticleDTO updateArticle(String id, NewsArticleRequest request);

    void deleteArticle(String id);
}

