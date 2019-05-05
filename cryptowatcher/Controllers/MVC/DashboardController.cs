using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using cryptowatcher.AI;
using cryptowatcher.Model;

namespace cryptowatcher.Controllers
{
    public class DashboardController : Controller
    {
        private readonly AppDbContext dbContext;

        public DashboardController([FromServices] AppDbContext appDbContext)
        {
            dbContext = appDbContext;
        }

        public IActionResult Index()
        {
            CoreAI coreAI = new CoreAI(dbContext);
            coreAI.SaveHistoryData("BTC_USDT");

            return View();
        }
    }
}
