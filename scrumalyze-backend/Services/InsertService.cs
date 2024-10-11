using Scrumalyze.Data;
using Scrumalyze.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Commands
{
    public class InsertService
    {
        private readonly ScrumalyzeContext _context;

        public InsertService(ScrumalyzeContext context)
        {
            _context = context;
        }
    }
}
