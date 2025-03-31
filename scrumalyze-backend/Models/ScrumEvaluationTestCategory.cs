using Newtonsoft.Json;
using Scrumalyze.Models.Scrumalyze.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Scrumalyze.Models
{
    public class ScrumEvaluationTestCategory
    {
        public int ScrumEvaluationTestCategoryID { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? CategoryDescription { get; set; } = string.Empty;

        [JsonIgnore]
        public required ICollection<ScrumEvaluationTest> Tests { get; set; }
    }
}
