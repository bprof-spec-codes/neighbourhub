using Data;
using Entities.Dtos.Vote;
using Entities.Models;
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

        public VoteLogic(Repository<Vote> voteRepository)
        {
            this.voteRepository = voteRepository;
        }

        private VoteDto ToDto(Vote vote)
        {
            return new VoteDto
            {
                Id = vote.Id,
                Title = vote.Title,
                Description = vote.Description,
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
            return voteRepository.GetAll().Where(v => v.IsActive).Select(ToDto);
        }

        public IEnumerable<VoteDto> GetInactive() 
        {
            return voteRepository.GetAll().Where(v => !v.IsActive).Select(ToDto);
        }

        public void Delete(string id)
        {
            voteRepository.DeleteById(id);
        }
    }
}
