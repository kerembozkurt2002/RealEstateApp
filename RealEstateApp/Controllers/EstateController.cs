using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApp.Context;
using RealEstateApp.DTO.EstateDTO;
using RealEstateApp.Entities;

namespace RealEstateApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EstateController : ControllerBase
    {

        private readonly EstateContext context;

        public EstateController(EstateContext context)
        {
            this.context = context;
        }

        [HttpPost]
        [Route("AddEstate")]
        public IActionResult Post([FromBody] AddEstateDTO estate)
        {
            var newEstate = context.Estates.Add(estate.ToEstate());
            context.SaveChanges();

            var response = context.Estates.Include(a => a.Currency)
                                        .Include(a => a.EstateType)
                                        .Include(a => a.Status)
                                        .FirstOrDefault(x => x.Id == newEstate.Entity.Id && !x.IsDeleted);

            if (response == null)
            {
                return BadRequest("Failed to create estate.");
            }

            return Ok(new { estateId = newEstate.Entity.Id });
        }


        [HttpGet]
        [Route("GetEstateById")]
        public IActionResult Get(int id)
        {
            var estate = context.Estates.Include(a => a.Currency)
                                    .Include(a => a.EstateType)
                                    .Include(a => a.Status)

                .FirstOrDefault(x => x.Id == id && !x.IsDeleted);
            if (estate == null) return NotFound();


            return Ok(EstateInfoDTO.FromEstate(estate));
        }

        [HttpPut]
        [Route("EditEstate")]

        public IActionResult Put(EditEstateDTO editEstateDTO)
        {
            int id = editEstateDTO.Id;

            string name = editEstateDTO.Name;
            int CurrencyId = editEstateDTO.CurrencyId;
            int EstateTypeId = editEstateDTO.EstateTypeId;
            int StatusId = editEstateDTO.StatusId;
            string UserId=editEstateDTO.UserId;

            int StartDate=editEstateDTO.StartDate;
            int EndDate=editEstateDTO.EndDate;
            double Price=editEstateDTO.Price;
            double Latitude = editEstateDTO.Latitude;
            double Longitude = editEstateDTO.Longitude;

            var estate = context.Estates.FirstOrDefault(x => x.Id == id);
            if (estate is null) { return NotFound(); }

            estate.CurrencyId = CurrencyId;
            estate.EstateTypeId = EstateTypeId;
            estate.StatusId = StatusId;
            estate.UserId = UserId;

            estate.Name = name;
            estate.StartDate = StartDate;
            estate.EndDate = EndDate;
            estate.Price = Price;
            estate.Latitude = Latitude;
            estate.Longitude = Longitude;

            context.SaveChanges();
            return Ok(EstateInfoDTO.FromEstate(estate));
        }


        [HttpDelete]
        [Route("DeleteEstate")]

        public IActionResult Delete(int id)
        {
            var estate = context.Estates.FirstOrDefault(x => x.Id == id);
            if (estate == null) return NotFound();
            estate.IsDeleted = true;

            context.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        [Route("GetAllEstates")]
        public IActionResult GetAll()
        {
            var estate = context.Estates.Include(a => a.Currency)
                                    .Include(a => a.EstateType)
                                    .Include(a => a.Status)

                                    .Where(x => !x.IsDeleted).ToList();
            if (estate == null) return NotFound();

            List<EstateInfoDTO> listDTO = new List<EstateInfoDTO>();

            estate.ForEach(x => listDTO.Add(EstateInfoDTO.FromEstate(x)));

            return Ok(listDTO);

        }
        [HttpGet]
        [Route("GetAllEstatesByServerSide")]
        public IActionResult GetAllEstatesByServerSide(int page = 1, int pageSize = 10)
        {
            var estatesQuery = context.Estates.Include(a => a.Currency)
                                              .Include(a => a.EstateType)
                                              .Include(a => a.Status)
                                              .Where(x => !x.IsDeleted);

            var totalCount = estatesQuery.Count();
            var estates = estatesQuery.Skip((page - 1) * pageSize)
                                      .Take(pageSize)
                                      .ToList();

            if (estates == null) return NotFound();

            List<EstateInfoDTO> listDTO = new List<EstateInfoDTO>();
            estates.ForEach(x => listDTO.Add(EstateInfoDTO.FromEstate(x)));

            var response = new
            {
                Data = listDTO,
                TotalCount = totalCount
            };

            return Ok(response);
        }



        [HttpGet]
        [Route("GetAllEstateNumbers")]
        public IActionResult GetAllEstateNumbers()
        {
            var estateCounts = context.Estates
                                    .Where(x => !x.IsDeleted)
                                    .GroupBy(x => x.EstateType.EstateTypeName)
                                    .Select(group => new
                                    {
                                        EstateType = group.Key,
                                        Count = group.Count()
                                    })
                                    .ToList();

            if (estateCounts == null || estateCounts.Count == 0) return NotFound();

            return Ok(estateCounts);
        }

        [HttpGet]
        [Route("GetAllEstateStatusNumbers")]
        public IActionResult GetAllEstateStatusNumbers()
        {
            var estateCounts = context.Estates
                                    .Where(x => !x.IsDeleted)
                                    .GroupBy(x => x.Status.StatusName)
                                    .Select(group => new
                                    {
                                        EstateType = group.Key,
                                        Count = group.Count()
                                    })
                                    .ToList();

            if (estateCounts == null || estateCounts.Count == 0) return NotFound();

            return Ok(estateCounts);
        }


        [HttpPost]
        [Route("UploadPhotos")]
        public async Task<IActionResult> UploadPhotos(int estateId, List<IFormFile> files)
        {
            var estate = await context.Estates.FindAsync(estateId);
            if (estate == null)
            {
                return NotFound("Estate not found.");
            }

            if (files == null || !files.Any())
            {
                return BadRequest("No files uploaded.");
            }

            var photoIds = new List<int>();

            foreach (var file in files)
            {
                if (file.Length == 0)
                {
                    continue;
                }

                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream);

                var photo = new Photo
                {
                    FileName = file.FileName,
                    FileType = file.ContentType,
                    Data = memoryStream.ToArray(),
                    EstateId = estateId,
                };

                context.Photos.Add(photo);
                await context.SaveChangesAsync();

                photoIds.Add(photo.Id);
            }

            return Ok(new { photoIds });
        }


        [HttpGet]
        [Route("GetPhotosByEstateId")]
        public IActionResult GetPhotosByEstateId(int estateId )
        {
            var photos = context.Photos.Where(p => p.EstateId == estateId && !p.IsDeleted).ToList();
            if (photos == null || !photos.Any())
            {
                return NotFound("No photos found.");
            }

            var photoDtos = photos.Select(p => new
            {
                p.Id,
                p.FileName,
                p.FileType,
                p.Data
            });

            return Ok(photoDtos);
        }


        [HttpDelete]
        [Route("DeletePhotoById")]
        public IActionResult DeletePhotoById(int photoId)
        {
            var temp = context.Photos.FirstOrDefault(x => x.Id == photoId);
            if (temp == null) return NotFound();
            temp.IsDeleted = true;

            context.SaveChanges();

            return NoContent();
        }

        [HttpDelete]
        [Route("DeletePhotoByIdList")]
        public IActionResult DeletePhotoByIdList([FromBody] List<int> photos)
        {
            if (photos == null || !photos.Any())
            {
                return BadRequest("No photo IDs provided.");
            }

            foreach (var selectedId in photos)
            {
                var temp = context.Photos.FirstOrDefault(x => x.Id == selectedId);
                if (temp == null)
                {
                    return NotFound($"Photo with ID {selectedId} not found.");
                }
                temp.IsDeleted = true;
            }

            context.SaveChanges();

            return NoContent();
        }
    }
}
