using MVC5BP.Model;
using MVC5BP.Service;
using System.Web.Http;
using Newtonsoft.Json;
using MVC5BP.UI.Modules;

namespace MVC5BP.UI.Controllers.API
{
    [RoutePrefix("api/Home")]
	
	public class HomeAPIController : ApiController
	{
        //initialize service object  

         public HomeAPIController()
        {
        }
 
    }
}
