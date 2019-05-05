using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace cryptowatcher.Model
{
    public class AIModel
    {
        public int Id { get; set; }
        public string CurrencyName { get; set; }
        public DateTime Date { get; set; }
        public double DateUTC { get; set; }
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
