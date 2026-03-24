using Data;
using Entities.Dtos.Vote;
using Entities.Enums;
using Entities.Helpers;
using Entities.Models;
using Logic.Helper;
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

        public VoteLogic(Repository<Vote> voteRepository, DtoProvider dtoProvider)
        {
            this.voteRepository = voteRepository;
            this.dtoProvider = dtoProvider;
        }

        private VoteDto ToDto(Vote vote)
        {
            return new VoteDto
            {
                Id = vote.Id,
                Title = vote.Title,
                Deadline = vote.Deadline,
                IsActive = vote.IsActive,
                YesCount = vote.Entries.Count(e => e.Option == VoteOption.Yes),
                NoCount = vote.Entries.Count(e => e.Option == VoteOption.No),
                AbstainCount = vote.Entries.Count(e => e.Option == VoteOption.Abstain)
            };
        }

        public IEnumerable<VoteDto> GetAll()
        {
            return voteRepository.GetAll().Select(ToDto);
        }

        public IEnumerable<VoteDto> GetActive()
        {
            return voteRepository.GetAll()
                .Where(v => v.Deadline > DateTime.Now)
                .Select(ToDto);
        }

        public IEnumerable<VoteDto> GetInactive() 
        {
            return voteRepository.GetAll()
                .Where(v => v.Deadline <= DateTime.Now)
                .Select(ToDto);
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
            voteRepository.DeleteById(id);
        }
    }
}
