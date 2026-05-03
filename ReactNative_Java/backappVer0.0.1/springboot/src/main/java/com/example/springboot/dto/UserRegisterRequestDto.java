package com.example.springboot.dto;

/*
 * ユーザー登録リクエストクラス<br>
 * フロントから受け取る登録情報を保持する。<br>
 */
public class UserRegisterRequestDto {

    private String username;
    private String password;
    private String email;

    /*
     * ユーザー名取得メソッド<br>
     *
     * @return String ユーザー名
     */
    public String getUsername() {
        return username;
    }

    /*
     * ユーザー名設定メソッド<br>
     *
     * @param username ユーザー名
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /*
     * パスワード取得メソッド<br>
     *
     * @return String パスワード
     */
    public String getPassword() {
        return password;
    }

    /*
     * パスワード設定メソッド<br>
     *
     * @param password パスワード
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /*
     * メールアドレス取得メソッド<br>
     *
     * @return String メールアドレス
     */
    public String getEmail() {
        return email;
    }

    /*
     * メールアドレス設定メソッド<br>
     *
     * @param email メールアドレス
     */
    public void setEmail(String email) {
        this.email = email;
    }
}
