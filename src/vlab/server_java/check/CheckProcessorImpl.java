package vlab.server_java.check;

import com.fasterxml.jackson.databind.ObjectMapper;
import rlcp.check.ConditionForChecking;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.check.PreCheckProcessor.PreCheckResult;
import rlcp.server.processor.check.PreCheckResultAwareCheckProcessor;
import static vlab.server_java.model.util.Util.unescapeParam;
import java.math.BigDecimal;

import vlab.server_java.model.rayCalculator.RayCalculator;
/**
 * Simple CheckProcessor implementation. Supposed to be changed as needed to provide
 * necessary Check method support.
 */
public class CheckProcessorImpl implements PreCheckResultAwareCheckProcessor<String> {
    @Override
    public CheckingSingleConditionResult checkSingleCondition(ConditionForChecking condition, String instructions, GeneratingResult generatingResult) throws Exception {
        //do check logic here
        double mark;
        String comment = "";
        try{
            ObjectMapper mapper = new ObjectMapper();
            RayCalculator rayCalculator = new RayCalculator(mapper.readValue(unescapeParam(instructions), double[][].class));
            mark = rayCalculator.calculateMark(mapper.readValue(unescapeParam(generatingResult.getCode()), double[].class), comment);
        } catch (Exception e){
            mark = 0;
            comment = e.getMessage();
        }
        return new CheckingSingleConditionResult(new BigDecimal(mark), comment);
    }

    @Override
    public void setPreCheckResult(PreCheckResult<String> preCheckResult) {}
}
