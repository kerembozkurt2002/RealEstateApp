using RealEstateApp.Entities;

namespace RealEstateApp.DTO.PriceDTO
{
    public class AddCurrencyDTO : BaseCurrencyDTO
    {
        public Currency ToPrice()
        {
            return new Currency()
            {
                CurrencyType = this.CurrencyType,
            };
        }
    }
}
