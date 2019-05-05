
using Microsoft.EntityFrameworkCore;

namespace cryptowatcher.Model
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public virtual DbSet<Currency> Currency { get; set; }
        public virtual DbSet<AIModel> AIModel { get; set; }
    }
}
