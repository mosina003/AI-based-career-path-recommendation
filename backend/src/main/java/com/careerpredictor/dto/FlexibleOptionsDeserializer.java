package com.careerpredictor.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FlexibleOptionsDeserializer extends JsonDeserializer<List<QuizQuestionDTO.Option>> {
    
    @Override
    public List<QuizQuestionDTO.Option> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        List<QuizQuestionDTO.Option> options = new ArrayList<>();
        
        if (p.getCurrentToken() == JsonToken.START_ARRAY) {
            while (p.nextToken() != JsonToken.END_ARRAY) {
                if (p.getCurrentToken() == JsonToken.VALUE_STRING) {
                    // Simple string option (like ScenarioSolver)
                    String text = p.getValueAsString();
                    options.add(new QuizQuestionDTO.Option(text));
                } else if (p.getCurrentToken() == JsonToken.START_OBJECT) {
                    // Complex object option (like TechQuiz)
                    JsonNode node = p.getCodec().readTree(p);
                    QuizQuestionDTO.Option option = new QuizQuestionDTO.Option();
                    
                    if (node.has("text")) {
                        option.setText(node.get("text").asText());
                    }
                    
                    if (node.has("career_weights")) {
                        JsonNode careerWeightsNode = node.get("career_weights");
                        Map<String, Integer> careerWeights = new java.util.HashMap<>();
                        careerWeightsNode.fieldNames().forEachRemaining(fieldName -> {
                            careerWeights.put(fieldName, careerWeightsNode.get(fieldName).asInt());
                        });
                        option.setCareerWeights(careerWeights);
                    }
                    
                    options.add(option);
                }
            }
        }
        
        return options;
    }
}