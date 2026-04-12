using Data;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using Microsoft.Extensions.Options;

namespace Logic.Logic;

public class DocumentLogic
{
    private readonly Repository<Document> _docuementRepository;
    private readonly FileStorageSettings _fileStorageSettings;
    private readonly DtoProvider _dtoProvider;

    public DocumentLogic(Repository<Document> docuementRepository, IOptions<FileStorageSettings> fileStorageSettings, DtoProvider dtoProvider)
    {
        _docuementRepository = docuementRepository;
        _fileStorageSettings = fileStorageSettings.Value;
        _dtoProvider = dtoProvider;
    }
    
    
    public async Task<string> UploadDocumentAsync((Stream fileStream, string fileName, string title) file)
    {
        var fileName = file.fileName;
        var path = Path.Combine(_fileStorageSettings.StoragePath, "uploads", "documents", file.fileName);

        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        await using (var output = new FileStream(path, FileMode.Create))
        {
            await file.fileStream.CopyToAsync(output);
        }
        
        var relativePath = $"uploads/documents/{fileName}";
        
        Document document = new Document()
        {
            Title = file.title,
            Path = relativePath
        };
        
        _docuementRepository.Add(document);
        _docuementRepository.Update(document);

        return document.Path;
    }
    
    public DocumentDownloadResultDto GetDocument(string id)
    {
        var document = _docuementRepository.GetAll().FirstOrDefault(d => d.Id == id);
        if (document == null)
            throw new FileNotFoundException("Document not found");
        
        var path = Path.Combine(_fileStorageSettings.StoragePath, document.Path);
        if (!File.Exists(path))
            throw new FileNotFoundException("File not found on disk");
        
        var fileName = string.IsNullOrWhiteSpace(document.Title) ? $"{document.Id}.pdf" : document.Title;

        return new DocumentDownloadResultDto(File.ReadAllBytes(path), fileName);
    }

    public List<DocumentShortViewDto> GetAllDocuments()
    {
        var documents = _docuementRepository.GetAll().ToList();
        var mappedDocuments = _dtoProvider.Mapper.Map<List<DocumentShortViewDto>>(documents);
        
        return mappedDocuments;
    }
    public void DeleteDocument(string id)
    {
        var document = _docuementRepository.GetAll().FirstOrDefault(d => d.Id == id);
        if (document == null)
            throw new FileNotFoundException("Document not found");
        
        var path = Path.Combine(_fileStorageSettings.StoragePath, document.Path);
        if (File.Exists(path))
            File.Delete(path);
        
        _docuementRepository.Delete(document);
    }
}