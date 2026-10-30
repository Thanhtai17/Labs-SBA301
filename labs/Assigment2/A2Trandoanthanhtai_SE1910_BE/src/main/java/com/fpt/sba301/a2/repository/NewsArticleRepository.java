/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2.repository;

import com.fpt.sba301.a2.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    boolean existsByCreatedBy_AccountId(Short accountId);

    boolean existsByCategory_CategoryId(Short categoryId);

    List<NewsArticle> findByNewsStatusOrderByCreatedDateDesc(Boolean newsStatus);

    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);

    @Query("SELECT DISTINCT n FROM NewsArticle n LEFT JOIN n.tags t WHERE " +
           "(:keyword IS NULL OR LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR n.category.categoryId = :categoryId) AND " +
           "(:tagId IS NULL OR t.tagId = :tagId) AND " +
           "(:status IS NULL OR n.newsStatus = :status) AND " +
           "(:createdById IS NULL OR n.createdBy.accountId = :createdById) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchArticles(
            @Param("keyword") String keyword,
            @Param("categoryId") Short categoryId,
            @Param("tagId") Integer tagId,
            @Param("status") Boolean status,
            @Param("createdById") Short createdById
    );
}

