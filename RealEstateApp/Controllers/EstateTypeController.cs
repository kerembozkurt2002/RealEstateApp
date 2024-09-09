using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Context;
using RealEstateApp.DTO.EstateTypeDTO;
using RealEstateApp.DTO.PriceDTO;

namespace RealEstateApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstateTypeController : ControllerBase
    {


        private readonly EstateContext context;

        public EstateTypeController(EstateContext context)
        {
            this.context = context;
        }


        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("AddEstateType")]
        public IActionResult Post([FromBody] AddEstateTypeDTO flat)
        {
            var response = context.EstateTypes.Add(flat.ToEstateType());
            context.SaveChanges();

            return Ok(EstateTypeInfoDTO.FromEstateType(response.Entity));
        }



        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Route("EditEstateType")]
        public IActionResult Put(EditEstateTypeDTO estateTypeDTO)
        {
            int id = estateTypeDTO.Id;
            string EstateTypeName = estateTypeDTO.EstateTypeName;

            var temp = context.EstateTypes.FirstOrDefault(x => x.Id == id);
            if (temp is null) { return NotFound(); }
            temp.EstateTypeName = EstateTypeName;

            context.SaveChanges();
            return Ok(EstateTypeInfoDTO.FromEstateType(temp));
        }

        [HttpGet]
        [Route("GetEstateTypeById")]
        public IActionResult Get(int id)
        {
            var temp = context.EstateTypes.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (temp == null) return NotFound();

            return Ok(EstateTypeInfoDTO.FromEstateType(temp));
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [Route("DeleteEstateType")]
        public IActionResult Delete(int id)
        {
            var temp = context.EstateTypes.FirstOrDefault(x => x.Id == id);
            if (temp == null) return NotFound();
            temp.IsDeleted = true;

            context.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        [Route("GetAllEstateTypes")]
        public IActionResult GetAll()
        {

            var temp = context.EstateTypes.Where(x => !x.IsDeleted).ToList();
            if (temp == null) return NotFound();

            List<EstateTypeInfoDTO> listDTO = new List<EstateTypeInfoDTO>();

            temp.ForEach(x => listDTO.Add(EstateTypeInfoDTO.FromEstateType(x)));

            return Ok(listDTO);

        }



    }
}
