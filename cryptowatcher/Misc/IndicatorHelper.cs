using System;
using TicTacTec.TA.Library;

namespace cryptowatcher.Misc
{
    public static class IndicatorHelper
    {
        public static double CalculateRsi(int period, double[] data)
        {
            int beginIndex, outNBElements;
            double[] rsiValues = new double[10];

            int position = data.Length - 1;

            var returnCode = Core.Rsi(position, position, data, period, out beginIndex, out outNBElements, rsiValues);

            if (returnCode == Core.RetCode.Success)
            {
                if (outNBElements > 0)
                {
                    return  Math.Round(rsiValues[outNBElements - 1],2); //Take current RSI (last one of the valid values)                      
                }
            }

            return 0;
        }

    }
}
