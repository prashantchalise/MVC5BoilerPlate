using System.Collections.Generic;
using System.Configuration;
using System.Web.Http;
using CodeGen;
using Newtonsoft.Json;

namespace MVC5BP.UI.Controllers.API
{
    [RoutePrefix("api/Home")]
	
	public class HomeAPIController : ApiController
	{
        //initialize service object  

        ICodeGenService _codeGenService;
        public HomeAPIController()
        {
            _codeGenService = new CodeGenService(ConfigurationManager.ConnectionStrings["RolpoContext"].ConnectionString);
        }


        #region "CodeGen Service"

        /// <summary>
        /// Load DDLs
        /// </summary>
        [HttpPost, Route("LoadDDLs")]
        public DDLJson LoadDDLs([FromBody] DDLFilterList filterList)
        {
            //Guid organizationId = new Guid("3EC0CBCE-7D8B-40E8-B6B7-7AB0FC48666A");

            //if (HttpContext.Current.User.Identity.IsAuthenticated) {
            //    var user = GetCurrentUser();
            //    organizationId = user.OrganizationId;
            //}
            var json = JsonConvert.SerializeObject(filterList.FilterList);
            System.Xml.Linq.XDocument xml = JsonConvert.DeserializeXNode("{\"Data\":" + json + "}", "root");

            return _codeGenService.GetDDLItemsList(pageName: filterList.PageName, ddlListXML: xml.ToString());

        }

        /// <summary>
        ///Load Columns Details
        /// </summary>
        [HttpPost, Route("CodeGen_LoadColumnsDetails")]
        public IEnumerable<TableColumns> CodeGen_LoadColumnsDetails([FromBody] string tableName)
        {
            return _codeGenService.GetTableColumnsList(tableId: tableName);
        }


        /// <summary>
        /// Finally !! Generate Code
        /// </summary>
        [HttpPost, Route("CodeGen_GenerateCode")]
        public CodeResults CodeGen_GenerateCode([FromBody] TableInfo tblInfo)
        {
            return _codeGenService.GetCodeResult(tblInfo);

        }



        #endregion

    }
}
