//namespace RealEstateApp.Entities
//{
//    public class Photo : BaseEntity
//    {
//        public string Url { get; set; }
//        public int EstateId { get; set; }
//        public Estate Estate { get; set; }
//    }
//}


namespace RealEstateApp.Entities
{
    public class Photo : BaseEntity
    {
        public string FileName { get; set; }
        public string FileType { get; set; }
        public byte[] Data { get; set; }  // Fotoğrafın dosya içeriğini saklayacak
        public int EstateId { get; set; }
        public Estate Estate { get; set; }
    }
}

