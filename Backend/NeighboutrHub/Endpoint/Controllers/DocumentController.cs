using Logic.Logic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Endpoint.Dtos;
using Entities.Models;

namespace Endpoint.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentController : ControllerBase
{
    private readonly DocumentLogic _documentLogic;

    public DocumentController(DocumentLogic documentLogic)
    {
        _documentLogic  = documentLogic; 
    }
    
    [HttpPost]
    [Consumes("multipart/form-data")]
    //[Authorize]
    public async Task<IActionResult> UploadDocument([FromForm] DocumentUploadRequestDto request)
    {
        var file = request.File;

        if (file == null)
            return BadRequest("No file uploaded");
        
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (ext != ".pdf")
            return BadRequest("Invalid file type");
        
        var fileStream = (stream: file.OpenReadStream(), fileName: file.FileName);

        try
        {
            var uploadedDocument = await _documentLogic.UploadDocumentAsync(fileStream);
            return Ok(uploadedDocument);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id}/download")]
    public IActionResult DownloadDocument([FromRoute] string id)
    {
        try
        {
            var document = _documentLogic.GetDocument(id);

            return File(
                fileContents: document.Content,
                contentType: "application/pdf",
                fileDownloadName: document.FileName,
                enableRangeProcessing: true
            );
        }
        catch (FileNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet]
    public List<DocumentShortViewDto> GetAllDocuments()
    {
        return _documentLogic.GetAllDocuments();
    }

    [HttpDelete("{id}")]
    public void DeleteDocument([FromRoute] string id)
    {
        _documentLogic.DeleteDocument(id);
    }
}