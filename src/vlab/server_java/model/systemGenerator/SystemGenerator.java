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
abstract class SystemGenerator {
    //первый - угол луча или размер предмета
    //второй - высота луча или положение предмета
    protected double firstInitialParameter, secondInitialParameter;
    protected double currentFirstParameter, currentSecondParameter;
    
    protected int[] arrayOfTries, arrayOfHeightsOrA, opticalFocusesPosition, opticalLensesPosition;
    protected double[] arrayOfAlphasOrY;
    protected double[] system;
    
    final public void generateSystem(int minF, int maxF, int minH, int maxH, int minD, int maxD, int numberOfLenses) {
        this.arrayOfTries = new int[numberOfLenses];
	    this.arrayOfAlphasOrY = new double[numberOfLenses+1];
	    this.arrayOfHeightsOrA = new int[numberOfLenses+1];
	    this.opticalFocusesPosition = new int[numberOfLenses*2];
	    this.opticalLensesPosition = new int[numberOfLenses];
        this.system = new double[numberOfLenses*2+2];
        
        boolean systemIsBad = true;
        while (systemIsBad) {
            makeRayOrObject(minH, maxH);
            for (int i = 0; i < numberOfLenses; i++) {
                if (i < 0)
                    break; 		//Если вернулись с кривым лучом или объектом, пересчитаем их
                this.arrayOfTries[i]++;
                int fBack, d;
                if (i == 0)
                    fBack = (int)Math.floor(Math.random() * (maxF - minF) + 1) + minF;
                else
                    if (Math.random() >= 0.6)
                        fBack = (int)Math.floor(Math.random() * (maxF - minF) + 1) + minF;
                    else
                        fBack = - (int)Math.floor(Math.random() * (maxF - minF) + 1) - minF;
                d = (int)Math.floor(Math.random() * (maxD - minD) + 1) + minD;
                //немного индусского кода
                if (i == 0)
                    this.opticalLensesPosition[i] = 0;
                if (i < numberOfLenses - 1)
                    this.opticalLensesPosition[i+1] = (i==0 ? d : this.opticalLensesPosition[i] + d);
                //индусский код закончился
                this.opticalFocusesPosition[2*i] = this.opticalLensesPosition[i] - Math.abs(fBack);
                this.opticalFocusesPosition[2*i+1] = this.opticalLensesPosition[i] + Math.abs(fBack);
                if (checkLensOptical(i, fBack, d, (i == numberOfLenses - 1)) &&
                        checkLensGraphical(i)){
                    this.system[2*i] = fBack;
                    this.arrayOfAlphasOrY[i+1] = this.currentFirstParameter;
                    this.arrayOfHeightsOrA[i+1] = (int)this.currentSecondParameter;
                    if (numberOfLenses > 1 &&
                            i != numberOfLenses - 1)
                        this.system[2*i + 1] = d;
                    if (i == numberOfLenses - 1)
                        // если лучик прошел через последнюю линзу и она (линза) - нормуль, то система годная
                        systemIsBad = false;
                    } else {
                        if (this.arrayOfTries[i] >= 50)
                            //Если перебрали с попытками, откатимся на линзу назад
                            i -= 2;
                        else
                            //Если линза нас тупо не устраивает, просто пересчитаем ее
                            i--;
                }
            }
        }
        this.system[numberOfLenses*2] = this.firstInitialParameter;
        this.system[numberOfLenses*2+1] = this.secondInitialParameter;
    }

    final public double[] getSystem() {
        return this.system;
    }

    private boolean checkLensGraphical(int lensNumber) {
        boolean isNextLensInsideFocalPlanes = false;
        for (int i = 0; i < 2*lensNumber; i++)
            if (Math.abs(opticalLensesPosition[lensNumber] - opticalFocusesPosition[i]) < 20)
                isNextLensInsideFocalPlanes = true;
            boolean isFocusInsidePreviousLens = false;
            for (int i = 0; i <= lensNumber; i++)
                if (Math.abs(opticalLensesPosition[i] - opticalFocusesPosition[2*lensNumber]) < 20)
                    isFocusInsidePreviousLens = true;
            return !isNextLensInsideFocalPlanes && !isFocusInsidePreviousLens;
    }
    
    abstract protected void makeRayOrObject(int minH, int maxH);
    abstract protected boolean checkLensOptical(int lensNumber, int fBack, int d, boolean lastLens);
}
