/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package vlab.server_java.model.systemGenerator;

/**
 *
 * @author olegtrifonov
 */
public class RaySystemGenerator extends SystemGenerator {
    @Override
    protected boolean checkLensOptical(int lensNumber, int fBack, int d, boolean lastLens) {
        boolean isRayRoundsNextLens = false;
	    double beta, heightOnNextLensOrFocalPlane = 0;
        double alpha = this.arrayOfAlphasOrY[lensNumber];
        double h = this.arrayOfHeightsOrA[lensNumber];
	    beta = (180/Math.PI) * Math.acos((h+(-fBack/Math.tan(alpha * Math.PI/180)))/Math.sqrt(Math.pow(h+(-fBack/Math.tan(alpha * Math.PI/180)),2) + Math.pow(fBack, 2)));
	    beta = fBack > 0 ? beta : 180 - beta;
        if (!lastLens) {
		    if (fBack < d)
                heightOnNextLensOrFocalPlane = (beta > 90? d/Math.abs(Math.tan(beta * Math.PI/180)) : -d/Math.abs(Math.tan(beta * Math.PI/180))) + h;
		    else
                heightOnNextLensOrFocalPlane = (beta > 90? Math.abs(fBack)/Math.abs(Math.tan(beta * Math.PI/180)) : -Math.abs(fBack)/Math.abs(Math.tan(beta * Math.PI/180))) + h;
		    if (Math.abs(heightOnNextLensOrFocalPlane) > 255)
                isRayRoundsNextLens = true;
        }
        if (!isRayRoundsNextLens) {
            this.currentFirstParameter = 180 - beta;
            this.currentSecondParameter = heightOnNextLensOrFocalPlane;
        }
        boolean additionalCheckCompleted = false;
        if (fBack > 0 && (Math.abs(fBack/Math.tan(arrayOfAlphasOrY[lensNumber]*Math.PI/180)))<255)
            additionalCheckCompleted = true;
	    if (fBack < 0 && (Math.abs(fBack*Math.tan((arrayOfAlphasOrY[lensNumber] - 90)*Math.PI/180)) < 265))
            additionalCheckCompleted = true;
        return !isRayRoundsNextLens && additionalCheckCompleted;
    }
    
    @Override
    protected void makeRayOrObject(int minH, int maxH) {
        //create initial ray
        this.firstInitialParameter = Math.random() * Math.PI/2 - Math.PI/4;
        this.arrayOfAlphasOrY[0] = (this.firstInitialParameter > 0? -(Math.abs(this.firstInitialParameter) * (180/Math.PI)) : (Math.abs(this.firstInitialParameter) * (180/Math.PI))) + 90;
        this.secondInitialParameter = Math.floor(Math.random() * (maxH - minH) + 1) + minH;
        this.secondInitialParameter = Math.random() >= 0.5 ? this.secondInitialParameter : -this.secondInitialParameter;
        this.arrayOfHeightsOrA[0] = (int)this.secondInitialParameter;
    }
}
