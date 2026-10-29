/**
 * Project: FUNewsManagementSystem - Assignment 02
 * Course: SBA301 - Integrate Single Page Application with Spring Boot
 * 
 * Author: Tran Doan Thanh Tai (Student ID: CE190084)
 * Class: SE1910
 * GitHub: Thanhtai17 (nhantai0317@gmail.com)
 * Date: October 30, 2026
 */
package com.fpt.sba301.a2;

import com.fpt.sba301.a2.dto.LoginRequest;
import com.fpt.sba301.a2.dto.LoginResponse;
import com.fpt.sba301.a2.dto.NewsArticleDTO;
import com.fpt.sba301.a2.exception.BusinessConflictException;
import com.fpt.sba301.a2.service.CategoryService;
import com.fpt.sba301.a2.service.NewsArticleService;
import com.fpt.sba301.a2.service.SystemAccountService;
import com.fpt.sba301.a2.service.TagService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class A2ApplicationTests {

    @Autowired
    private SystemAccountService accountService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private NewsArticleService newsArticleService;

    @Autowired
    private TagService tagService;

    @Test
    void contextLoads() {
        Assertions.assertNotNull(accountService);
    }

    @Test
    void testLoginAdmin() {
        LoginResponse admin = accountService.login(new LoginRequest("SteveParis@FUNewsManagement.org", "@1"));
        Assertions.assertNotNull(admin);
        Assertions.assertEquals(1, admin.getAccountRole());
        Assertions.assertEquals("Steve Paris", admin.getAccountName());
    }

    @Test
    void testLoginStaff() {
        LoginResponse staff = accountService.login(new LoginRequest("EmmaWilliam@FUNewsManagement.org", "@1"));
        Assertions.assertNotNull(staff);
        Assertions.assertEquals(2, staff.getAccountRole());
        Assertions.assertEquals("Emma William", staff.getAccountName());
    }

    @Test
    void testCategoriesAndNews() {
        Assertions.assertFalse(categoryService.getAllCategories(null, null).isEmpty());
        Assertions.assertFalse(tagService.getAllTags().isEmpty());

        List<NewsArticleDTO> news = newsArticleService.searchArticles(null, null, null, null, null);
        Assertions.assertFalse(news.isEmpty());
    }

    @Test
    void testCannotDeleteAccountWithArticles() {
        // Account ID 1 (Emma William) has created articles 1 & 2
        Assertions.assertThrows(BusinessConflictException.class, () -> {
            accountService.deleteAccount((short) 1);
        });
    }

    @Test
    void testCannotDeleteCategoryWithArticles() {
        // Category ID 1 (Academic news) has articles 3, 4, 5
        Assertions.assertThrows(BusinessConflictException.class, () -> {
            categoryService.deleteCategory((short) 1);
        });
    }
}
