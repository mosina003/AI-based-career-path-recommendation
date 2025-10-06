package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = com.careerpredictor.CareerPathPredictorApplication.class)
@TestPropertySource(locations = "classpath:application-test.properties")
class DemoApplicationTests {

    @Test
    void contextLoads() {
        // Test passes if Spring context loads successfully
    }
}
