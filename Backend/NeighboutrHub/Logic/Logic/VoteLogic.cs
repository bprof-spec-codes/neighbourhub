using Data;
using Entities.Dtos.Vote;
using Entities.Enums;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Logic.Logic
{
    public class VoteLogic
    {
        private readonly Repository<Vote> voteRepository;
        private readonly DtoProvider dtoProvider;
        private readonly Repository<VoteEntry> voteEntryRepository;
        



        public VoteLogic(Repository<Vote> voteRepository, Repository<VoteEntry> voteEntryRepository, DtoProvider dtoProvider)
        {
            this.voteRepository = voteRepository;
            this.voteEntryRepository = voteEntryRepository;
            this.dtoProvider = dtoProvider;
            
        }
        private VoteDto ToDto(Vote vote, string? userId = null)
        {
            return new VoteDto
            {
                Id = vote.Id,
                Title = vote.Title,
                Deadline = vote.Deadline,
                IsActive = vote.IsActive,
                YesCount = vote.Entries.Count(e => e.Option == VoteOption.Yes),
                NoCount = vote.Entries.Count(e => e.Option == VoteOption.No),
                AbstainCount = vote.Entries.Count(e => e.Option == VoteOption.Abstain),
                HasVoted = userId != null && vote.Entries.Any(e => e.UserId == userId)
            };
        }

        public IEnumerable<VoteDto> GetAll()
        {
            return voteRepository.GetAll()
                .Include(v => v.Entries)
                .AsEnumerable()
                .Select(v => ToDto(v));
        }

        public IEnumerable<VoteDto> GetActive(string? userId = null)
        {
            return voteRepository.GetAll()
                .Include(v => v.Entries)
                .Where(v => v.Deadline > DateTime.Now)
                .AsEnumerable()
                .Select(v => ToDto(v, userId));
        }

        public IEnumerable<VoteDto> GetInactive()
        {
            return voteRepository.GetAll()
                .Include(v => v.Entries)
                .Where(v => v.Deadline <= DateTime.Now)
                .AsEnumerable()
                .Select(v => ToDto(v));
        }

        public VoteDto Create(CreateVoteDto dto, string createdByUserId)
        {
            if (dto.Deadline <= DateTime.Now)
                throw new ArgumentException("A deadline jövőbeli dátum kell legyen.");
            var vote = dtoProvider.Mapper.Map<Vote>(dto);
            vote.CreatedByUserId = createdByUserId;
            voteRepository.Add(vote);
            return ToDto(vote);
        }
        public void Delete(string id)
        {
            var entries = voteEntryRepository.GetAll()
                .Where(e => e.VoteId == id)
                .ToList();

            voteEntryRepository.DeleteRange(entries);
            voteRepository.DeleteById(id);
        }


        public void CastVote(string voteId, string userId, VoteOption option)
        {
            var vote = voteRepository.GetAll().FirstOrDefault(v => v.Id == voteId);
            if (vote == null)
                throw new ArgumentException("A szavazat nem található.");
            if (!vote.IsActive)
                throw new ArgumentException("A szavazat már lezárult.");

            

            var alreadyVoted = voteEntryRepository.GetAll()
                .Any(e => e.VoteId == voteId && e.UserId == userId);
            if (alreadyVoted)
                throw new ArgumentException("Már szavaztál erre a szavazásra.");

            
            var entry = new VoteEntry
            {
                VoteId = voteId,
                UserId = userId,
                Option = option
            };
            voteEntryRepository.Add(entry);
        }
    }
}