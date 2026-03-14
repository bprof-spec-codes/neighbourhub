using Data;
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

        public IEnumerable<Vote> GetAll()
        {
            return voteRepository.GetAll();
        }

        public IEnumerable<Vote> GetActive()
        {
            return voteRepository.GetAll().Where(v => v.IsActive);
        }

        public IEnumerable<Vote> GetInactive() 
        {
            return voteRepository.GetAll().Where(v => !v.IsActive);
        }

        public void Delete(string id)
        {
            voteRepository.DeleteById(id);
        }
    }
}
