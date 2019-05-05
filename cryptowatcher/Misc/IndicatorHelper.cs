using System;
using System.Collections.Generic;
using System.Linq;
using cryptowatcher.TransferClass;
using TicTacTec.TA.Library;

namespace cryptowatcher.Misc
{
    public static class IndicatorHelper
    {
        public static double CalculateRsi(int period, List<PoloQuoteTransfer> quotationList)
        {
            var data = quotationList.Select(p => p.Close).ToArray();
            int beginIndex;
            int outNBElements;
            double[] rsiValues = new double[data.Length];

            var returnCode = Core.Rsi(0, data.Length - 1, data, period, out beginIndex, out outNBElements, rsiValues);

            if (returnCode == Core.RetCode.Success)
            {
                if (outNBElements > 0)
                {
                    return Math.Round(rsiValues[0], 2); //Take current RSI (last one of the valid values)                      
                }
            }

            return 0;
        }

        public static void CalculateRsiList(int period, ref List<PoloQuoteTransfer> ttt)
        {
            var quotationList = ttt.TakeLast(50).Reverse().ToList();
            var data = quotationList.Select(p => p.Close).ToArray();
            int beginIndex;
            int outNBElements;
            double[] rsiValues = new double[data.Length];

            var returnCode = Core.Rsi(data.Length - 20, data.Length - 1, data, 14, out beginIndex, out outNBElements, rsiValues);

            if (returnCode == Core.RetCode.Success && outNBElements > 0)
            {
                for (int i = 0; i <= data.Length-1; i++)
                {
                    //quotationList[i + 14].RSI = Math.Round(rsiValues[i], 2);
                    quotationList[i].RSI = Math.Round(rsiValues[data.Length-1-i], 2);
                }
            }
        }

        public static double CalculateMacd(List<PoloQuoteTransfer> quotationList)
        {
            var data = quotationList.Select(p => p.Close).ToArray();
            int beginIndex;
            int outNBElements;
            double[] outMACD = new double[data.Length];
            double[] outMACDSignal = new double[data.Length];
            double[] outMACDHist = new double[data.Length];

            var returnCode = Core.MacdFix(0, data.Length - 1, data, 2, out beginIndex, out outNBElements, outMACD, outMACDSignal, outMACDHist);
            
            if (returnCode == Core.RetCode.Success)
            {
                if (outNBElements > 0)
                {
                    return outMACDHist[0]; 
                }
            }     
            return 0;   
        }
        public static void CalculateMacdList(ref List<PoloQuoteTransfer> quotationList)
        {
            var data = quotationList.Select(p => p.Close).ToArray();
            int beginIndex;
            int outNBElements;
            double[] outMACD = new double[data.Length];
            double[] outMACDSignal = new double[data.Length];
            double[] outMACDHist = new double[data.Length];

            var returnCode = Core.MacdFix(0, data.Length - 1, data, 2, out beginIndex, out outNBElements, outMACD, outMACDSignal, outMACDHist);


            // if (returnCode == Core.RetCode.Success && outNBElements > 0)
            // {
            //     for (int i = 0; i < outNBElements; i++)
            //     {
            //         quotationList[i+14].RSI = Math.Round(rsiValues[i],2);
            //     }                 
            // }
        }
    }
}
