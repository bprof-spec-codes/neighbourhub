using Entities.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Models
{
    public class UserLoginLog : IIdEntity
    {
        public UserLoginLog()
        {
            Id = Guid.NewGuid().ToString();
        }

        public string Id { get; set; } // Ez kell az IIdEntity miatt
        public string UserId { get; set; }
        public DateTime LoginDate { get; set; }
    }
}
