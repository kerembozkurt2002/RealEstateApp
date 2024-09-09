using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RealEstateApp.Context;
using RealEstateApp.DTO.PriceDTO;

namespace RealEstateApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly EstateContext context;

        public CurrencyController(EstateContext context)
        {
            this.context = context;
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Route("AddCurrency")]
        public IActionResult Post([FromBody] AddCurrencyDTO flat)
        {
            var response = context.Currency.Add(flat.ToPrice());
            context.SaveChanges();

            return Ok(CurrencyInfoDTO.FromCurrency(response.Entity));
        }



        [HttpPut]
        [Authorize(Roles = "Admin")]
        [Route("EditCurrency")]
        public IActionResult Put(EditCurrencyDTO currencyDTO)
        {
            int id = currencyDTO.Id;
            string CurrencyType = currencyDTO.CurrencyType;

            var temp = context.Currency.FirstOrDefault(x => x.Id == id);
            if (temp is null) { return NotFound(); }
            temp.CurrencyType = CurrencyType;

            context.SaveChanges();
            return Ok(CurrencyInfoDTO.FromCurrency(temp));
        }

        [HttpGet]
        [Route("GetCurrencyById")]
        public IActionResult Get(int id)
        {
            var temp = context.Currency.FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (temp == null) return NotFound();

            return Ok(CurrencyInfoDTO.FromCurrency(temp));
        }

        [HttpDelete]
        [Authorize(Roles = "Admin")]
        [Route("DeleteCurrency")]
        public IActionResult Delete(int id)
        {
            var temp = context.Currency.FirstOrDefault(x => x.Id == id);
            if (temp == null) return NotFound();
            temp.IsDeleted = true;

            context.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        [Route("GetAllCurrencies")]
        public IActionResult GetAll()
        {

            var temp = context.Currency.Where(x => !x.IsDeleted).ToList();
            if (temp == null) return NotFound();

            List<CurrencyInfoDTO> listDTO = new List<CurrencyInfoDTO>();

            temp.ForEach(x => listDTO.Add(CurrencyInfoDTO.FromCurrency(x)));

            return Ok(listDTO);

        }






    }
}
