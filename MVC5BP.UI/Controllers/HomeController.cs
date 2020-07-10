using System;
using System.Data;
using System.Data.SqlClient;
using System.Web.Mvc;
using MVC5BP.Model;
using MVC5BP.Service;

namespace MVC5BP.UI.Controllers
{
    public class HomeController : Controller
	{
         public HomeController()
        {
             
        }
  
        public ActionResult Index()
		{
			return View();
		}

        public ActionResult Agent()
        {
            return View();
        }


    }
}