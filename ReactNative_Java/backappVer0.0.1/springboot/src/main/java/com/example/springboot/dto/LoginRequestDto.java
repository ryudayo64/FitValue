package com.example.springboot.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/*
 * ログインリクエストクラス<br>
 * ログイン時の入力値を保持する。<br>
 */
@Getter  // クラスのフィールド全てにゲッターを作る
@Setter  // クラスのフィールド全てにセッターを作る
@NoArgsConstructor  // 引数無しのコンストラクタを作る
@AllArgsConstructor  // 全てのフィールドを引数に取るコンストラクタを作る
public class LoginRequestDto {

    /**
     * ユーザー名
     */
    private String username;
    /**
     * パスワード
     */
    private String password;

}
