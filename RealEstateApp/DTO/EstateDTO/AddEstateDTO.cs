using RealEstateApp.Entities;

namespace RealEstateApp.DTO.EstateDTO
{
    public class AddEstateDTO : BaseEstateDTO
    {
        public Estate ToEstate()
        {
            return new Estate()
            {
                Name = this.Name,
                StartDate=this.StartDate,
                EndDate=this.EndDate,
                Price=this.Price,
                Latitude=this.Latitude,
                Longitude=this.Longitude,

                StatusId    = this.StatusId,
                EstateTypeId = this.EstateTypeId,
                CurrencyId = this.CurrencyId,
                UserId = this.UserId,
            };
        }
    }
}
