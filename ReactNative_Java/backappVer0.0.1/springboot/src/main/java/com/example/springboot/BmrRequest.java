package com.example.springboot;

public record BmrRequest(
        String gender, // "男" or "女"
        int age,
        double heightCm,
        double weightKg
) {}
