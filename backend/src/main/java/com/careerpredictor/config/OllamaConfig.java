package com.careerpredictor.config;

import dev.langchain4j.model.ollama.OllamaLanguageModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OllamaConfig {

    @Bean
    public OllamaLanguageModel ollamaLanguageModel() {
        return OllamaLanguageModel.builder()
                .baseUrl("http://localhost:11434") // Ollama default API
                .modelName("phi3")                 // ✅ Use "phi3" instead of "phi"
                .temperature(0.7)                 // controls creativity
                .timeout(java.time.Duration.ofMinutes(3)) // ✅ Add timeout
                .build();
    }
}
