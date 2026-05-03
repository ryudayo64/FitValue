package com.example.springboot;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot.entity.User;

/**
 * usersクラスの検索を行うRepositry
 */
public interface UserRepository extends JpaRepository<User, Integer> {

    // username で1件取得（存在しない場合は空）
    Optional<User> findByUsername(String username);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password WHERE u.username = :username")
    void updatePassword(
            @Param("username") String username,
            @Param("password") String password
    );

    
}
