namespace RealEstateApp.DTO.EstateDTO
{
    public class BaseEstateDTO
    {
        public string Name { get; set; }
        public int EstateTypeId { get; set; }
        public int StatusId { get; set; }
        public int CurrencyId { get; set; }
        public int StartDate { get; set; }
        public int EndDate { get; set; }
        public double Price { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string UserId { get; set; }

    }
}
