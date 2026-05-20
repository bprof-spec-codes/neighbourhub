using Entities.Dtos.User;
using Entities.Helpers;
using Entities.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Text.RegularExpressions;

namespace Logic.Logic;

public class UserLogic
{
	private readonly UserManager<AppUser> _userManager;
	private readonly FileStorageSettings _fileStorageSettings;

	public UserLogic(UserManager<AppUser> userManager, IOptions<FileStorageSettings> fileStorageSettings)
	{
		_userManager = userManager;
		_fileStorageSettings = fileStorageSettings.Value;
	}

	public List<ResidentListItemDto> GetResidents()
	{
		var residents = _userManager.Users
			.Select(u => new ResidentListItemDto
			{
				Id = u.Id,
				FirstName = u.FirstName,
				LastName = u.LastName,
				Email = u.Email ?? string.Empty,
				PhoneNumber = u.PhoneNumber ?? string.Empty,
				ProfileImagePath = u.ProfileImagePath,
				ApartmentNumber = u.ApartmentNumber ?? new List<string>(),
				ParkingSpace = u.ParkingSpace ?? new List<string>(),
				Storage = u.Storage ?? new List<string>()
			})
			.OrderBy(u => u.LastName)
			.ThenBy(u => u.FirstName)
			.ToList();

		return residents;
	}

	public async Task<ResidentListItemDto> GetResidentByIdAsync(string id)
	{
		var user = await _userManager.FindByIdAsync(id);
		if (user == null)
		{
			throw new KeyNotFoundException("A felhasználó nem található.");
		}

		return new ResidentListItemDto
		{
			Id = user.Id,
			FirstName = user.FirstName,
			LastName = user.LastName,
			Email = user.Email ?? string.Empty,
			PhoneNumber = user.PhoneNumber ?? string.Empty,
			ProfileImagePath = user.ProfileImagePath,
			ApartmentNumber = user.ApartmentNumber ?? new List<string>(),
			ParkingSpace = user.ParkingSpace ?? new List<string>(),
			Storage = user.Storage ?? new List<string>()
		};
	}

	public async Task<IReadOnlyList<string>> UpdateResidentAsync(string id, AdminUpdateResidentDto dto)
	{
		var user = await _userManager.FindByIdAsync(id);
		if (user == null)
		{
			throw new KeyNotFoundException("A felhasználó nem található.");
		}

		if (!IsValidEmail(dto.Email))
		{
			throw new ArgumentException("Az email cím formátuma nem megfelelő!");
		}

		if (!IsValidPhoneNumber(dto.PhoneNumber))
		{
			throw new ArgumentException("A telefonszám formátuma nem megfelelő!");
		}

		var existingUserWithEmail = await _userManager.FindByEmailAsync(dto.Email);
		if (existingUserWithEmail != null && existingUserWithEmail.Id != user.Id)
		{
			throw new ArgumentException("Az email cím már foglalt.");
		}

		var apartmentNumbers = NormalizeCodes(dto.ApartmentNumber);
		var parkingSpaces = NormalizeCodes(dto.ParkingSpace);
		var storages = NormalizeCodes(dto.Storage);

		var otherUsers = _userManager.Users.Where(u => u.Id != user.Id).ToList();

		var apartmentConflict = otherUsers
			.SelectMany(u => u.ApartmentNumber ?? new List<string>())
			.Select(NormalizeCode)
			.FirstOrDefault(code => apartmentNumbers.Contains(code));

		if (!string.IsNullOrEmpty(apartmentConflict))
		{
			throw new ArgumentException($"A lakás már másik lakóhoz van rendelve: {apartmentConflict}");
		}

		var parkingConflict = otherUsers
			.SelectMany(u => u.ParkingSpace ?? new List<string>())
			.Select(NormalizeCode)
			.FirstOrDefault(code => parkingSpaces.Contains(code));

		if (!string.IsNullOrEmpty(parkingConflict))
		{
			throw new ArgumentException($"A parkolóhely már másik lakóhoz van rendelve: {parkingConflict}");
		}

		var storageConflict = otherUsers
			.SelectMany(u => u.Storage ?? new List<string>())
			.Select(NormalizeCode)
			.FirstOrDefault(code => storages.Contains(code));

		if (!string.IsNullOrEmpty(storageConflict))
		{
			throw new ArgumentException($"A tároló már másik lakóhoz van rendelve: {storageConflict}");
		}

		user.FirstName = dto.FirstName;
		user.LastName = dto.LastName;
		user.Email = dto.Email;
		user.UserName = dto.Email.Split('@')[0];
		user.PhoneNumber = dto.PhoneNumber;
		user.ApartmentNumber = apartmentNumbers;
		user.ParkingSpace = parkingSpaces;
		user.Storage = storages;

		var result = await _userManager.UpdateAsync(user);
		if (!result.Succeeded)
		{
			return result.Errors.Select(e => e.Description).ToList();
		}

		return Array.Empty<string>();
	}

	public async Task<(byte[] Bytes, string ContentType)> GetProfileImageAsync(string id)
	{
		var user = await _userManager.FindByIdAsync(id);
		if (user == null || string.IsNullOrEmpty(user.ProfileImagePath))
			throw new KeyNotFoundException("Profile image not found.");

		var fullPath = Path.Combine(_fileStorageSettings.StoragePath, user.ProfileImagePath);
		if (!File.Exists(fullPath))
			throw new KeyNotFoundException("Profile image file not found.");

		var ext = Path.GetExtension(fullPath).ToLowerInvariant();
		var contentType = ext switch
		{
			".jpg" or ".jpeg" => "image/jpeg",
			".png" => "image/png",
			".webp" => "image/webp",
			".gif" => "image/gif",
			_ => "application/octet-stream"
		};

		var bytes = await File.ReadAllBytesAsync(fullPath);
		return (bytes, contentType);
	}

	public async Task<string> UploadResidentProfileImageAsync(string id, Stream fileStream, string originalFileName)
	{
		var user = await _userManager.FindByIdAsync(id);
		if (user == null)
		{
			throw new KeyNotFoundException("A felhasználó nem található.");
		}

		var ext = Path.GetExtension(originalFileName).ToLowerInvariant();
		var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
		if (!allowedExtensions.Contains(ext))
		{
			throw new ArgumentException("Invalid image file type.");
		}

		var uploadsDirectory = Path.Combine(_fileStorageSettings.StoragePath, "uploads", "profiles");
		Directory.CreateDirectory(uploadsDirectory);

		var uniqueFileName = $"{Guid.NewGuid():N}{ext}";
		var fullPath = Path.Combine(uploadsDirectory, uniqueFileName);

		await using (var stream = new FileStream(fullPath, FileMode.Create))
		{
			await fileStream.CopyToAsync(stream);
		}

		var oldRelativePath = user.ProfileImagePath;
		user.ProfileImagePath = $"uploads/profiles/{uniqueFileName}";

		var updateResult = await _userManager.UpdateAsync(user);
		if (!updateResult.Succeeded)
		{
			if (File.Exists(fullPath))
			{
				File.Delete(fullPath);
			}

			var errors = string.Join(" | ", updateResult.Errors.Select(e => e.Description));
			throw new InvalidOperationException(string.IsNullOrWhiteSpace(errors) ? "Failed to update user profile image." : errors);
		}

		DeleteOldProfileImageIfLocal(oldRelativePath, user.ProfileImagePath);

		return user.ProfileImagePath;
	}

	private static List<string> NormalizeCodes(List<string>? codes)
	{
		return (codes ?? new List<string>())
			.SelectMany(SplitCodes)
			.Select(NormalizeCode)
			.Where(code => !string.IsNullOrWhiteSpace(code))
			.Distinct()
			.ToList();
	}

	private static IEnumerable<string> SplitCodes(string? rawCodes)
	{
		if (string.IsNullOrWhiteSpace(rawCodes))
		{
			return Enumerable.Empty<string>();
		}

		return rawCodes
			.Split(new[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries)
			.Select(code => code.Trim())
			.Where(code => code.Length > 0);
	}

	private static string NormalizeCode(string? code)
	{
		return (code ?? string.Empty).Trim().ToUpperInvariant();
	}

	private void DeleteOldProfileImageIfLocal(string? oldPath, string? currentPath)
	{
		if (string.IsNullOrWhiteSpace(oldPath) || string.Equals(oldPath, currentPath, StringComparison.OrdinalIgnoreCase))
		{
			return;
		}

		var normalized = oldPath.Replace('\\', '/');
		if (!normalized.StartsWith("uploads/profiles/", StringComparison.OrdinalIgnoreCase))
		{
			return;
		}

		var fullOldPath = Path.Combine(_fileStorageSettings.StoragePath, normalized);
		if (File.Exists(fullOldPath))
		{
			File.Delete(fullOldPath);
		}
	}

	private static bool IsValidEmail(string email)
	{
		string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
		return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
	}

	private static bool IsValidPhoneNumber(string phoneNumber)
	{
		string pattern = @"^(\+36|06|36)?[\s\-]?(20|30|31|70|1|[2-9][0-9])[\s\-]?[0-9]{3}[\s\-]?[0-9]{3,4}$";

		if (string.IsNullOrWhiteSpace(phoneNumber))
		{
			return false;
		}

		return Regex.IsMatch(phoneNumber, pattern, RegexOptions.IgnoreCase);
	}
}
