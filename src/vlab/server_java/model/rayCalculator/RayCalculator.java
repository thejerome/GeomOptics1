/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vlab.server_java.model.rayCalculator;

import java.math.BigDecimal;

/**
 *
 * @author olegtrifonov
 */
public class RayCalculator {
    private double[][] data;
    
    public RayCalculator(double[][] data) {
        this.data = data;
    }
    
    public double[][] getData() {
        return this.data;
    }
    
    public double calculateMark(double[] system, String comment) {
        double mark = 0;
        for (int i = 0; i < data.length; i++) {
            double alpha, beta, betaR, h, fBack;
            alpha = data[i][1];
            beta = data[i][2];
            h = data[i][0];
            fBack = system[2 * i];
            betaR = (180 / Math.PI) * Math.acos((h + (-fBack / Math.tan(alpha * Math.PI / 180))) / Math.sqrt(Math.pow(h + (-fBack / Math.tan(alpha * Math.PI / 180)), 2) + Math.pow(fBack, 2)));
            betaR = fBack < 0 ? 180 - betaR : betaR;
            if (Math.abs(beta - betaR) <= 0.5)
                mark++;
        }
        mark /= (system.length - 2)/2; //todo check!!!
        return mark;
    }
}
