namespace Logic.Logic;

public class DocumentDownloadResultDto
{
    public byte[] Content { get; }
    public string FileName { get; }

    public DocumentDownloadResultDto(byte[] content, string fileName)
    {
        Content = content;
        FileName = fileName;
    }
}
