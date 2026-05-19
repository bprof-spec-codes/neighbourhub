using Microsoft.AspNetCore.Http;

namespace Endpoint.Dtos;

public class DocumentUploadRequestDto
{
	public string? Title { get; set; }
	public IFormFile? File { get; set; }
}
