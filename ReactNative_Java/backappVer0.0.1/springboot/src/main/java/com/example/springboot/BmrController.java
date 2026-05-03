package com.example.springboot;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/bmr")

/**
 * 基礎代謝計算機
 */
public class BmrController {
    
    /** 
     * @param req
     * @return Map<String, Object>
     */
    @PostMapping("/bmicalc")
    public Map<String, Object> bmicalc(@RequestBody BmrRequest req) {
        double bmr;

        if ("male".equalsIgnoreCase(req.gender())) {
            // 男性用ハリス・ベネディクト
            bmr = 66.47
                    + 13.397 * req.weightKg()
                    + 4.799 * req.heightCm()
                    - 5.677 * req.age()
                    + 88.362;
        } else {
            // 女性用ハリス・ベネディクト
            bmr = 655.1
                    + 9.247 * req.weightKg()
                    + 3.098 * req.heightCm() 
                    - 4.33  * req.age()
                    + 447.593;
        }

        return Map.of(
                "bmr", Math.round(bmr),
                "formula", "Harris-Benedict");
    }
}