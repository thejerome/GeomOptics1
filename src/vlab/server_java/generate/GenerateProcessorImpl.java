package vlab.server_java.generate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.generate.GenerateProcessor;

import vlab.server_java.model.systemGenerator.RaySystemGenerator;
import static vlab.server_java.model.util.Util.escapeParam;

/**
 * Simple GenerateProcessor implementation. Supposed to be changed as needed to
 * provide necessary Generate method support.
 */
public class GenerateProcessorImpl implements GenerateProcessor {
    @Override
    public GeneratingResult generate(String condition) {
        condition = condition.trim();
        ObjectMapper mapper = new ObjectMapper();
        //do Generate logic here
        String text = "Ваш вариант загружен в установку";
        String code = " ";
        String instructions = "";
        try {
            RaySystemGenerator systemGenerator = new RaySystemGenerator();
            int numberOfLenses = Integer.parseInt(condition);
            systemGenerator.generateSystem(50, 200, 20, 200, 25, 300, numberOfLenses);//Integer.parseInt(condition)); //вот тут задаются как раз параметры системы (кол-во линз итд)
            code = mapper.writeValueAsString(systemGenerator.getSystem());
        } catch (JsonProcessingException e) {
            code = "Failed, " + e.getOriginalMessage();
        }
        return new GeneratingResult(text, escapeParam(code), escapeParam(instructions));
    }
}
