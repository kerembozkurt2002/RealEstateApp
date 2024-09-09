using RealEstateApp.Entities;

namespace RealEstateApp.DTO.EstateTypeDTO
{
    public class AddEstateTypeDTO :BaseEstateTypeDTO
    {
        public EstateType ToEstateType()
        {
            return new EstateType()
            {
                EstateTypeName = this.EstateTypeName,
            };
        }
    }
}


