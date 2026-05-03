package com.example.springboot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot.UserRepository;
import com.example.springboot.dto.LoginRequestDto;
import com.example.springboot.dto.UserRegisterRequestDto;
import com.example.springboot.service.UserLoginService;
import com.example.springboot.service.UserRegisterService;

/*
 * 認証コントローラクラス<br>
 * ユーザー登録やログインの入口となるAPIを提供する。<br>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserLoginService userLoginService;
    private final UserRegisterService userRegisterService;

    // private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder;

    /*
     * コンストラクタ<br>
     *
     * @param userRegisterService 新規登録サービス
     * @param userLoginService ログインサービス
     */
    public AuthController(UserLoginService userLoginService, UserRegisterService userRegisterService, UserRepository userRepository, PasswordEncoder passwordEncoder) {

        this.userRegisterService = userRegisterService;
        this.userLoginService = userLoginService;
        // this.userRepository = userRepository;
        // this.passwordEncoder = passwordEncoder;

    }

    /*
     * ユーザー登録APIメソッド<br>
     * リクエストを受け取りユーザー登録を行う。<br>
     *
     * @param request 登録リクエスト
     * 
     * @return ResponseEntity レスポンスメッセージ
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegisterRequestDto request) {
        userRegisterService.registerUser(request);
        return ResponseEntity.ok("登録が完了しました。");
    }

    // @PostMapping("/hash-register")
    // public ResponseEntity<String> hashRegister(@RequestBody LoginRequestDto dto) {
    //     String hashed = passwordEncoder.encode(dto.getPassword());
    //     userRepository.updatePassword(dto.getUsername(), hashed);
    //     return ResponseEntity.ok("ハッシュ登録完了");
    // }

    /*
     * ログインAPIメソッド<br>
     * 入力値を検証しログイン可否を返却する。<br>
     *
     * @param request ログインリクエスト
     *  cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc、mmきj
     * @return ResponseEntity 結果メッセージ
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDto request) {

        try {
            userLoginService.login(request);
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }

        return ResponseEntity.ok("ログインに成功しました。");
    }
}
