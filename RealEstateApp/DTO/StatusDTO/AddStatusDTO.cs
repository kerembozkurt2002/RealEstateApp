using RealEstateApp.Entities;

namespace RealEstateApp.DTO.StatusDTO
{
    public class AddStatusDTO : BaseStatusDTO
    {
        public Status ToStatus()
        {
            return new Status()
            {
                StatusName = this.StatusName,
            };
        }
    }
}
