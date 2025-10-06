package com.careerpredictor.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class QuizQuestionDTO {
    
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("question")
    private String question;
    
    @JsonProperty("category")
    private String category;
    
    @JsonProperty("options")
    private List<Option> options;
    
    @JsonProperty("weight")
    private Integer weight;
    
    @JsonProperty("difficulty")
    private String difficulty;
    
    public int getWeightWithDefault() {
        return weight != null ? weight : 1;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Option {
        
        @JsonProperty("text")
        private String text;
        
        @JsonProperty("career_weights")
        private Map<String, Integer> careerWeights;
        
        public Option(String text) {
            this.text = text;
        }
    }
}
