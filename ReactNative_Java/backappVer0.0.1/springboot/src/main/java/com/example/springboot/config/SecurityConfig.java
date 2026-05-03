package com.example.springboot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/*
 * パスワードエンコード設定クラス<br>
 * アプリ全体で使用するPasswordEncoderのインスタンスを提供する。<br>
 */
@Configuration
public class SecurityConfig {

    /*
     * PasswordEncoder生成メソッド<br>
     * パスワードを安全にハッシュ化するためのエンコーダを返却する。<br>
     *
     * @return PasswordEncoder パスワードのハッシュを生成するエンコーダ
     */
    @Bean
    public PasswordEncoder passwordEncoder() {

        // BCrypt方式のハッシュ生成器を返す
        return new BCryptPasswordEncoder();
    }
}
