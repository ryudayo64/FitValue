package com.example.springboot.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.springboot.UserRepository;
import com.example.springboot.dto.UserRegisterRequestDto;
import com.example.springboot.entity.User;

/*
 * ユーザーサービスクラス<br>
 * ユーザー登録や検索の業務処理を担当する。<br>
 */
@Service
public class UserRegisterService {

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
    public UserRegisterService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /*
     * ユーザー登録メソッド<br>
     * ユーザー名重複を確認し、問題なければ登録する。<br>
     *
     * @param request 登録リクエスト
     * 
     * @return User 登録後のユーザー情報
     */
    public User registerUser(UserRegisterRequestDto request) {

        Optional<User> exists = userRepository.findByUsername(request.getUsername());

        if (exists.isPresent()) {
            throw new IllegalArgumentException("ユーザー名は既に使用されています。");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        String encoded = passwordEncoder.encode(request.getPassword());

        user.setPassword(encoded);

        return userRepository.save(user);
    }

}
