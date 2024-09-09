using RealEstateApp.Entities;

namespace RealEstateApp.DTO.EstateTypeDTO
{
    public class EstateTypeInfoDTO : BaseEstateTypeDTO
    {
        public int Id { get; set; }

        public static EstateTypeInfoDTO FromEstateType(EstateType estateType)
        {
            return new EstateTypeInfoDTO
            {
                Id = estateType.Id,
                EstateTypeName= estateType.EstateTypeName,
            };

        }

    }
}

