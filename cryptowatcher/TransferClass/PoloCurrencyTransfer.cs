namespace cryptowatcher.TransferClass
{
    public class PoloCurrencyTransfer
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public string Last { get; set; }
        public string LowestAsk { get; set; }
        public string HighestBid { get; set; }
        public string PercentChange { get; set; }
        public string BaseVolume { get; set; }
        public string QuoteVolume { get; set; }
        public string IsFrozen { get; set; }
        public string High24hr { get; set; }
        public string Low24hr { get; set; }
        public string RSI { get; set; }
    }
}
