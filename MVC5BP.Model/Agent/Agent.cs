/* 
Model for [dbo].[Agent] 
Created by: Prashant 
Created On: 10/07/2020 
 */
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MVC5BP.Model
{
    [Table("TBL_Agent")]
    public class Agent : AuditableEntity<long>
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AgentId { get; set; }


        [NotMapped]
        [Display(Name = "OrganizationId")]
        public Guid OrganizationId { get; set; }


        [Required]
        [MaxLength(150)]
        [Display(Name = "AgentName")]
        public string AgentName { get; set; }


        [Required]
        [MaxLength(25)]
        [Display(Name = "AgentShortCode")]
        public string AgentShortCode { get; set; }


        [MaxLength(200)]
        [Display(Name = "Address1")]
        public string Address1 { get; set; }


        [MaxLength(200)]
        [Display(Name = "Address2")]
        public string Address2 { get; set; }


        [MaxLength(20)]
        [Display(Name = "Phone1")]
        public string Phone1 { get; set; }


        [MaxLength(20)]
        [Display(Name = "Phone2")]
        public string Phone2 { get; set; }


        [Required]
        [MaxLength(150)]
        [Display(Name = "PrimaryContactEmail")]
        public string PrimaryContactEmail { get; set; }


        [NotMapped]
        [Display(Name = "TransactionCurrencyId")]
        public int TransactionCurrencyId { get; set; }


        [MaxLength(1073741823)]
        [Display(Name = "AgentInfo")]
        public string AgentInfo { get; set; }

    }

    /* Agent View Model */
    public class AgentViewModel
    {
        public Int64 RowNumber { get; set; }
        public int AgentId { get; set; }
        public string AgentName { get; set; }
        public string AgentShortCode { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Phone1 { get; set; }
        public string Phone2 { get; set; }
        public string PrimaryContactEmail { get; set; }
        public string AgentInfo { get; set; }

        public int TotalCount { get; set; }
    }

    /* Agent View Model (Input) */
    public class AgentViewModel_Input
    {
        public int? AgentId { get; set; }
        public string AgentName { get; set; }
        public int? PageNumber { get; set; }
        public int? PageSize { get; set; }
        public int? ShowAll { get; set; }
    }
}
