using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RealEstateApp.Entities; // Add namespace for ApplicationUser and ApplicationRole if needed

namespace RealEstateApp.Context
{
    public class EstateContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
    {
        public EstateContext(DbContextOptions<EstateContext> options) : base(options)
        {
        }

        public DbSet<Estate> Estates { get; set; }
        public DbSet<Currency> Currency { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<EstateType> EstateTypes { get; set; }
        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Estate>()
                .HasMany(e => e.Photos)
                .WithOne(p => p.Estate)
                .HasForeignKey(p => p.EstateId);

            base.OnModelCreating(modelBuilder);
        }
    }
}








//---------------------------------------------------------------------------------------------------------------------------------
//using Microsoft.EntityFrameworkCore;
//using RealEstateApp.Entities;

//namespace RealEstateApp.Context
//{
//    public class EstateContext : DbContext
//    {
//        public EstateContext(DbContextOptions<EstateContext> options) : base(options)
//        {
//        }

//        public DbSet<Estate> Estates { get; set; }

//        public DbSet<Currency> Currency { get; set; }
//        public DbSet<Status> Statuses { get; set; }
//        public DbSet<EstateType> EstateTypes { get; set; }

//        public DbSet<Photo> Photos { get; set; }

//        protected override void OnModelCreating(ModelBuilder modelBuilder)
//        {
//            modelBuilder.Entity<Estate>()
//                .HasMany(e => e.Photos)
//                .WithOne(p => p.Estate)
//                .HasForeignKey(p => p.EstateId);

//            base.OnModelCreating(modelBuilder);
//        }
//    }
//}
