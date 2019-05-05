
using System;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Collections.Generic;
using cryptowatcher.TransferClass;
using TicTacTec.TA.Library;
using cryptowatcher.Misc;
using System.Linq;
using Newtonsoft.Json.Linq;
using cryptowatcher.Model;

namespace cryptowatcher.AI
{
    public class CoreAI
    {
        private Uri uriCurrency = new Uri("https://poloniex.com/public?command=returnChartData&currencyPair=");
        private readonly AppDbContext dbContext;
        public CoreAI(AppDbContext appDbContext)
        {
            dbContext = appDbContext;
        }

        public void SaveHistoryData(string currencyName)
        {
            //we get data for 1 year
            var poloData = GetHistoryData("USDT_BTC", 1);
            List<PoloQuoteTransfer> items = JsonConvert.DeserializeObject<List<PoloQuoteTransfer>>(poloData);

            //calculate RSI for all element
            IndicatorHelper.CalculateRsiList(14, ref items);

            //calculate MACD for all element
            IndicatorHelper.CalculateMacdList(ref items);

            //we calculate RSI for each element starting from the last one
            for (int i = items.Count - 1; i >= 1; i--)
            {
                items[i].AIPrediction = items[i].Close - items[i - 1].Close;
            }

            //save data to db
            // foreach (var item in items)
            // {
            //     dbContext.AIModel.Add(new AIModel()
            //     {
            //         CurrencyName = "USDT_BTC",
            //         Close = item.Close,
            //         DateUTC = item.Date,
            //         //Date = Convert date
            //         RSI = item.RSI,
            //         AIPrediction = item.AIPrediction,
            //         High = item.High,
            //         Low = item.Low,
            //         Open = item.Open,
            //         QuoteVolume = item.QuoteVolume,
            //         Volume = item.Volume,
            //         WeightedAverage = item.WeightedAverage

            //     });

            //     dbContext.SaveChanges();
            // }

        }

        #region helper

        //get list of data for x years + 14 days to calculate RSI
        public string GetHistoryData(string currencyName, int numberOfYear)
        {
            Int32 endDate = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            Int32 startDate = (Int32)(DateTime.UtcNow.AddDays(-numberOfYear*365).Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            //Int32 startDate = (Int32)(DateTime.UtcNow.AddDays(-200).Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string uri = string.Format("{0}{1}&start={2}&end={3}&period=86400", uriCurrency, currencyName, startDate, endDate);
            return GetPoloniexApiData(new Uri(uri));
        }

        private string GetPoloniexApiData(Uri ApiUri)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = ApiUri;

                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var response = client.GetAsync("").Result;
                    if (response.IsSuccessStatusCode)
                    {
                        return response.Content.ReadAsStringAsync().Result;
                    }
                }
            }
            catch (Exception ex)
            {
                return "";
            }

            return "";
        }

        #endregion
    }
}