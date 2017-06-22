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

namespace cryptowatcher.Controllers.API
{
    [Route("api/[controller]")]
    public class PoloniexController : Controller
    {
        /// <summary>
        /// Example of call to Poloniex API
        /// </summary>
        private Uri uriListOfCurrency = new Uri("https://poloniex.com/public?command=returnTicker");
        private Uri uriChartBTX_XMR = new Uri("https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&start=1405699200&end=9999999999&period=14400");

        // GET: api/values
        [HttpGet]
        public IEnumerable<PoloCurrencyTransfer> Get()
        {
            List<PoloCurrencyTransfer> result = new List<PoloCurrencyTransfer>();
            string poloniexApiData = GetPoloniexApiData(uriListOfCurrency);

            if (poloniexApiData != "")
            {
                Dictionary<string, PoloCurrencyTransfer> myDico = JsonConvert.DeserializeObject<Dictionary<string, PoloCurrencyTransfer>>(poloniexApiData);

                foreach (var item in myDico)
                {
                    item.Value.Name = item.Key;
                    item.Value.RSI = GetCurrencyRSI(item.Key.ToString()).ToString();
                    result.Add(item.Value);
                }
            }
            return result;
        }

        /// <summary>
        /// Get data for an example of chart
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetChartData")]
        public string GetChartData()
        {
            return GetPoloniexApiData(uriChartBTX_XMR);
        }

        /// <summary>
        /// Calculate the RSI for a currency
        /// </summary>
        /// <param name="currencyName">The currency name</param>
        /// <returns>The RSI</returns>
        private double GetCurrencyRSI(string currencyName)
        {
            Int32 endDate = (Int32)(DateTime.UtcNow.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            Int32 startDate = (Int32)(DateTime.UtcNow.AddDays(-14).Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
            string uri = string.Format("https://poloniex.com/public?command=returnChartData&currencyPair={0}&start={1}&end={2}&period=14400", currencyName, startDate, endDate);

            string poloniexApiData = GetPoloniexApiData(new Uri(uri));
            
            if(poloniexApiData!="")
            {
                List<PoloQuoteTransfer> quotationList = JsonConvert.DeserializeObject<List<PoloQuoteTransfer>>(poloniexApiData);
                return IndicatorHelper.CalculateRsi(14, quotationList.Select(p => p.Close).ToArray());

            }

            return 0;
        }

        #region Get data from Poloniex API

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
