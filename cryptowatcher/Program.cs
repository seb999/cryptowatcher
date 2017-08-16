using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore;

namespace cryptowatcher
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls("http://localhost:5456/")
                .Build();
        // public static void Main(string[] args)
        // {
        //     var host = new WebHostBuilder()
        //         .UseKestrel()
        //         //.UseUrls("http://*:5456/cryptowatcher")
        //         .UseContentRoot(Directory.GetCurrentDirectory())
        //         .UseIISIntegration()
        //         .UseStartup<Startup>()
        //         .UseApplicationInsights()
        //         .Build();

        //     host.Run();
        // }
    }
}
