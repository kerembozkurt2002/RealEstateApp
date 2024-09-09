using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Context;
using RealEstateApp.DTO.PriceDTO;
using RealEstateApp.DTO.StatusDTO;

namespace RealEstateApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles ="Admin")]
    public class StatusController : ControllerBase
    {

        private readonly EstateContext context;

        public StatusController(EstateContext context)
        {
            this.context = context;
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("AddStatus")]
        public IActionResult Post([FromBody] AddStatusDTO flat)
        {
            var response = context.Statuses.Add(flat.ToStatus());
            context.SaveChanges();

            return Ok(StatusInfoDTO.FromStatus(response.Entity));
        }



        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Route("EditStatus")]
        public IActionResult Put(EditStatusDTO statusDTO)
        {
            int id = statusDTO.Id;
            string StatusName = statusDTO.StatusName;

            var temp = context.Statuses.FirstOrDefault(x => x.Id == id);
            if (temp is null) { return NotFound(); }
            temp.StatusName = StatusName;

            context.SaveChanges();
            return Ok(StatusInfoDTO.FromStatus(temp));
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        [Route("GetStatusyById")]
        public IActionResult Get(int id)
        {
            var temp = context.Statuses.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (temp == null) return NotFound();

            return Ok(StatusInfoDTO.FromStatus(temp));
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [Route("DeleteStatus")]
        public IActionResult Delete(int id)
        {
            var temp = context.Statuses.FirstOrDefault(x => x.Id == id);
            if (temp == null) return NotFound();
            temp.IsDeleted = true;

            context.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        [Route("GetAllStatuses")]
        public IActionResult GetAll()
        {

            var temp = context.Statuses.Where(x => !x.IsDeleted).ToList();
            if (temp == null) return NotFound();

            List<StatusInfoDTO> listDTO = new List<StatusInfoDTO>();

            temp.ForEach(x => listDTO.Add(StatusInfoDTO.FromStatus(x)));

            return Ok(listDTO);

        }


    }
}
