using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace cryptowatcher.Model
{
    public class Currency
    {
        public int Id { get; set; }
        public int CurrencyId { get; set; }
        public string CurrencyName { get; set; }
        public DateTime AddDate { get; set; }
    }
}
