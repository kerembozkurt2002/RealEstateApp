using RealEstateApp.DTO.EstateTypeDTO;
using RealEstateApp.Entities;

namespace RealEstateApp.DTO.StatusDTO
{
    public class StatusInfoDTO : BaseStatusDTO
    {

        public int Id { get; set; }

        public static StatusInfoDTO FromStatus(Status status)
        {
            return new StatusInfoDTO
            {
                Id = status.Id,
                StatusName = status.StatusName,
            };

        }
    }
}
