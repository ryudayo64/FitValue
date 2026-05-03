/**
 * © 2026 RYU. All Rights Reserved.
 * Unauthorized copying, modification, distribution is prohibited.
 */
package com.example.springboot.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.springboot.UserRepository;
import com.example.springboot.dto.LoginRequestDto;
import com.example.springboot.entity.User;


/*
 * ユーザーサービスクラス<br>
 * ユーザー登録や検索の業務処理を担当する。<br>
 */
@Service
public class UserLoginService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /*
     * コンストラクタ<br>
     * リポジトリとエンコーダを受け取り初期化する。<br>
     *
     * @param userRepository ユーザーリポジトリ
     * 
     * @param passwordEncoder パスワードエンコーダ
     */
    public UserLoginService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /*
     * ログイン処理メソッド<br>
     * ユーザー名とパスワードを検証する。<br>
     *
     * @param request ログインリクエスト
     * 
     * @return User ログインユーザー情報
     */
    public User login(LoginRequestDto request) {

        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        System.out.print(userOpt);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("ユーザーが存在しません。");
        }

        User user = userOpt.get();
        // String hashed = passwordEncoder.encode("secret123");
        // userRepository.updatePassword("ryu", hashed);

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!matches) {

            throw new IllegalArgumentException("パスワードが正しくありません。");
        }

        return user;
    }

}
