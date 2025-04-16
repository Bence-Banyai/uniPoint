using AutoMapper;
using uniPoint_backend.Models;

namespace uniPoint_backend
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<Service, ServiceDto>();
        }
    }
}
