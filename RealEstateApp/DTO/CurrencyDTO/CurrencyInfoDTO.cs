using RealEstateApp.Entities;

namespace RealEstateApp.DTO.PriceDTO
{
    public class CurrencyInfoDTO : BaseCurrencyDTO
    {
        public int Id { get; set; }

        public static CurrencyInfoDTO FromCurrency(Currency price)
        {
            return new CurrencyInfoDTO
            {
                Id = price.Id,
                CurrencyType=price.CurrencyType,
            };

        }
    }
}
