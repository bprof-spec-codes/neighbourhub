using Microsoft.AspNetCore.Http;

namespace Endpoint.Dtos;

public class ResidentProfileImageUploadRequestDto
{
    public IFormFile? File { get; set; }
}
