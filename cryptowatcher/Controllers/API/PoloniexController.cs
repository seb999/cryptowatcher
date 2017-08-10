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

namespace cryptowatcher.Controllers.API
{
    [Route("api/[controller]")]
    public class PoloniexController : Controller
    {
        /// <summary>
        /// Example of call to Poloniex API
        /// </summary>
        private Uri uriListOfCurrency = new Uri("https://poloniex.com/public?command=returnTicker");
        private Uri uriCurrency = new Uri("https://poloniex.com/public?command=returnChartData&currencyPair=");
        private Uri uriOrder = new Uri("https://poloniex.com/public?command=returnOrderBook&currencyPair=");

        private readonly AppDbContext dbContext;

        public PoloniexController([FromServices] AppDbContext appDbContext)
        {
            dbContext = appDbContext;
        }

        // GET: api/values
        [HttpGet]
        [Route("{currencyName?}")]
        public IEnumerable<PoloCurrencyTransfer> Get(string currencyName = null)
        {
            List<PoloCurrencyTransfer> result = new List<PoloCurrencyTransfer>();
            string poloniexApiData = GetPoloniexApiData(uriListOfCurrency);

            if (poloniexApiData != "")
            {
                Dictionary<string, PoloCurrencyTransfer> myDico = JsonConvert.DeserializeObject<Dictionary<string, PoloCurrencyTransfer>>(poloniexApiData);

                foreach (var item in myDico)
                {
                    //For ecdc so reduce number of call in proxy
                    //if (item.Key != "BTC_BCN" && item.Key != "BTC_BTS" && item.Key != "BTC_BCH" && item.Key != "ETH_LSK" && item.Key != "ETH_REP") continue;

                    if (item.Key.Substring(0, 3) != currencyName && currencyName!=null) continue;
                    item.Value.Name = item.Key;
                    if (currencyName !=null)
                    {
                        item.Value.RSI = (double)GetCurrencyRSI(item.Key.ToString());
                    }
                    else
                    {
                        item.Value.RSI = 0.0;
                    };
                            
                    result.Add(item.Value);
                }
            }

            return result;
        }

        /// <summary>
        /// Get cotation for specific currency
        /// </summary>
        /// <param name="currencyName">The currency name</param>
        /// <returns>PoloCurrencyTransfer</returns>
        [HttpGet]
        [Route("GetCotation/{currencyName?}")]
        public PoloCurrencyTransfer GetCurrencyData(string currencyName = null)
        {
            if(currencyName == null) return null;
            
            List<PoloCurrencyTransfer> result = new List<PoloCurrencyTransfer>();
            string poloniexApiData = GetPoloniexApiData(uriListOfCurrency);

            if (poloniexApiData != "")
            {
                Dictionary<string, PoloCurrencyTransfer> myDico = JsonConvert.DeserializeObject<Dictionary<string, PoloCurrencyTransfer>>(poloniexApiData);

                foreach (var item in myDico)
                {
                    if (item.Key == currencyName)
                    {
                        item.Value.Name = item.Key;
                        item.Value.RSI = (double)GetCurrencyRSI(item.Key.ToString());
                        return item.Value;
                    }
                }
            }

            return null;
        }

        /// <summary>
        /// Get data for an example of chart
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetHistoryChartData/{currencyName}")]
        public string GetHistoryChartData(string currencyName)
        {
            Int32 endDate = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            Int32 startDate = (Int32)(DateTime.UtcNow.AddDays(-365).Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string uri = string.Format("{0}{1}&start={2}&end={3}&period=14400", uriCurrency, currencyName, startDate, endDate);
            return GetPoloniexApiData(new Uri(uri));
        }

        [HttpGet]
        [Route("GetDayChartData/{currencyName}")]
        public string GetDayChartData(string currencyName)
        {
            Int32 endDate = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            Int32 startDate = (Int32)(DateTime.UtcNow.AddDays(-1).Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string uri = string.Format("{0}{1}&start={2}&end={3}&period=300", uriCurrency, currencyName, startDate, endDate);
            return GetPoloniexApiData(new Uri(uri));
        }

        /// <summary>
        /// Get data for order table
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetOrderData/{currencyName}")]
        public List<PoloOrderTransfer> GetOrderData(string currencyName)
        {
            List<PoloOrderTransfer> result = new List<PoloOrderTransfer>();

            string uri = string.Format("{0}{1}&depth=10", uriOrder, currencyName);
            var poloData = GetPoloniexApiData(new Uri(uri));

            if (poloData != "")
            {
                Dictionary<string, object> myDico = JsonConvert.DeserializeObject<Dictionary<string, object>>(poloData);

                foreach (var item in myDico)
                {
                    if (item.Key == "asks")
                    {
                        JArray orderList = (JArray)item.Value;

                        foreach (var order in orderList)
                        {

                            result.Add(new PoloOrderTransfer() { AskPrice = order.ToObject<object[]>()[0].ToString(), AskQuantity = order.ToObject<object[]>()[1].ToString()});

                        }
                    }

                    if (item.Key == "bids")
                    {
                        JArray orderList = (JArray)item.Value;

                        for (var i = 0; i <orderList.Count(); i++)
                        {
                            {
                                result[i].BidPrice = orderList[i].ToObject<object[]>()[0].ToString();
                                result[i].BidQuantity = orderList[i].ToObject<object[]>()[1].ToString();
                            }
                        }
                    }
                }
            }

            return result;

        }

        [HttpGet]
        [Route("GetNewCurrencyList")]
        public List<Currency> GetNewCurrencyList()
        {
            try
            {
                SaveNewCurrency();

                //List new currency that are not older than 7 days 
                List<Currency> localCurrencyList = 
                    dbContext.Currency.Where(p=>DateTime.Compare(p.DateAdded.AddDays(7),DateTime.Now) >0 ).Select(p=>p).ToList();

                return localCurrencyList; 
            }
            catch (System.Exception e)
            {
                //use Serilog to store error in file here
                return new List<Currency>();
            }
        }

        #region helper

        /// <summary>
        /// Calculate the RSI for a currency
        /// </summary>
        /// <param name="currencyName">The currency name</param>
        /// <returns>The RSI</returns>
        private double GetCurrencyRSI(string currencyName)
        {
            Int32 endDate = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            Int32 startDate = (Int32)(DateTime.UtcNow.AddDays(-14).Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string uri = string.Format("{0}{1}&start={2}&end={3}&period=14400", uriCurrency, currencyName, startDate, endDate);

            string poloniexApiData = GetPoloniexApiData(new Uri(uri));
            
            if(poloniexApiData!="")
            {
                List<PoloQuoteTransfer> quotationList = JsonConvert.DeserializeObject<List<PoloQuoteTransfer>>(poloniexApiData);
                return IndicatorHelper.CalculateRsi(14, quotationList.Select(p => p.Close).ToArray());

            }

            return 0;
        }

        private void SaveNewCurrency()
        {
            //List of currency in local db
            List<Currency> localCurrencyList = dbContext.Currency.Select(p=>p).ToList();

            //List of currency from Poloniex API
            List<PoloCurrencyTransfer> currentCurrencyList = new List<PoloCurrencyTransfer>();
            string poloniexApiData = GetPoloniexApiData(uriListOfCurrency);

            if (poloniexApiData != "")
            {
                Dictionary<string, PoloCurrencyTransfer> myDico = JsonConvert.DeserializeObject<Dictionary<string, PoloCurrencyTransfer>>(poloniexApiData);

                foreach (var item in myDico)
                {    
                    if(localCurrencyList.Where(p=>p.CurrencyId == item.Value.Id).Select(p=>p.Id).FirstOrDefault() == 0)
                    {
                        dbContext.Currency.Add(new Currency() { 
                            CurrencyId = item.Value.Id , 
                            CurrencyName = item.Key,
                            DateAdded = DateTime.Now});
                    }
                }
                dbContext.SaveChanges();
            }
        }

        private string GetPoloniexApiData(Uri ApiUri)
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

            return "";
        }

        #endregion
    }
}
