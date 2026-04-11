using Microsoft.AspNetCore.Http;

namespace Endpoint.Dtos;

public class DocumentUploadRequestDto
{
	public IFormFile? File { get; set; }
}
