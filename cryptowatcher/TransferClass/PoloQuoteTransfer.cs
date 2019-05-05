using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace cryptowatcher.TransferClass
{
    public class PoloQuoteTransfer
    {
        public long Date { get; set; }
        public double High { get; set; }
        public double Low { get; set; }
        public double Open { get; set; }
        public double Close { get; set; }
        public double Volume { get; set; }
        public double QuoteVolume { get; set; }
        public double WeightedAverage { get; set; }
        public double RSI { get; set; }
        public double AIPrediction { get; set; }
    }
}
