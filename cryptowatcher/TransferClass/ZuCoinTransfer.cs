using System;
using System.Collections.Generic;


public class ZuCoin
{
    public string Name { get; set; }
    public string Coin { get; set; }
}

public class ZuCoinTransfer
{
    public bool Success { get; set; }
    public string Code { get; set; }
    public string Msg { get; set; }
    public string Timestamp { get; set; }
    public List<ZuCoin> Data { get; set; }
}