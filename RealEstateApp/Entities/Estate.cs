namespace RealEstateApp.Entities
{
    public class Estate : BaseEntity

    {
        public string Name { get; set; }
        public Status Status { get; set; }
        public int StatusId { get; set; }
        public EstateType EstateType { get; set; }
        public int EstateTypeId { get; set; }
        public Currency Currency { get; set; }
        public int CurrencyId { get; set; }

        public double Price { get; set; }
        public int StartDate { get; set; }
        public int EndDate { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string UserId { get; set; }
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();

    }

}
