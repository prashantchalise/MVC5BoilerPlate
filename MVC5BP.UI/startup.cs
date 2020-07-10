using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Microsoft.Owin;
using Owin;
using MVC5BP.UI.Modules;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Net;
using MVC5BP.UI.Controllers;
using System.Web;
using System.Web.Hosting;

[assembly: OwinStartupAttribute("MVC5BP.UI", typeof(MVC5BP.UI.Startup))]

namespace MVC5BP.UI
{
	public partial class Startup
	{
 
        public void Configuration(IAppBuilder app)
		{
			AreaRegistration.RegisterAllAreas();
 			GlobalConfiguration.Configure(WebApiConfig.Register);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);

            //Autofac Configuration
            var builder = new Autofac.ContainerBuilder();
            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());


            builder.RegisterModule(new ServiceModule());
            builder.RegisterModule(new EFModule());

            var container = builder.Build();

            //DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            // Set the dependency resolver for MVC.
            var mvcResolver = new AutofacDependencyResolver(container);
            DependencyResolver.SetResolver(mvcResolver);

            // Set the dependency resolver for Web API.
            var webApiResolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = webApiResolver;

            ApplicationContainer.Container = container;

            //Finally Configure Auth
            ConfigureAuth(app);
 
        }

        public static class ApplicationContainer
        {
            public static IContainer Container { get; set; }
        }


    }
	 
}
