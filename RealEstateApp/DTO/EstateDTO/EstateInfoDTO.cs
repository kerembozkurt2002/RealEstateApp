using RealEstateApp.Entities;

namespace RealEstateApp.DTO.EstateDTO
{
    public class EstateInfoDTO : BaseEstateDTO
    {
        public int Id { get; set; }
        public string EstateTypeName { get; set; }
        public double Price { get; set; }
        public string StatusName { get; set; }
        public string CurrencyType { get; set; }


        public static EstateInfoDTO FromEstate(Estate estate)
        {
            return new EstateInfoDTO()
            {
                Name = estate.Name,
                Latitude = estate.Latitude,
                Longitude = estate.Longitude,
                Price = estate.Price,
                StartDate = estate.StartDate,
                EndDate = estate.EndDate,


                EstateTypeName = estate.EstateType?.EstateTypeName, // Null check added
                StatusName = estate.Status?.StatusName, // Null check added
                CurrencyType = estate.Currency?.CurrencyType,

                Id = estate.Id,
                StatusId=estate.StatusId,
                EstateTypeId=estate.EstateTypeId,
                CurrencyId=estate.CurrencyId,
                UserId=estate.UserId,

            };
        }

    }
}
