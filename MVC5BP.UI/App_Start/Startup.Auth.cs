using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Owin;
using System.Web;
using Microsoft.Owin.Security.OAuth;
using System.Web.Http;

namespace MVC5BP.UI
{
    public partial class Startup
	{
		public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; } 

		// For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
		public void ConfigureAuth(IAppBuilder app)
		{ 
			//// Configure the db context, user manager and signin manager to use a single instance per request
			//app.CreatePerOwinContext(ApplicationDbContext.Create);
			//app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
			//app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);

 
            app.UseCookieAuthentication(new CookieAuthenticationOptions
			{

				AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
				CookieHttpOnly = false,
				LoginPath = new PathString("/Account/Login"),
				Provider = new CookieAuthenticationProvider()
				{
					OnApplyRedirect = ctx =>
					{
						if (!IsApiRequest(ctx.Request))
						{
							ctx.Response.Redirect(ctx.RedirectUri);
						}
					}
				}
			});

			//use a cookie to temporarily store information about a user logging in with a third party login provider
			app.UseExternalSignInCookie(Microsoft.AspNet.Identity.DefaultAuthenticationTypes.ExternalCookie);
 
			app.MapWhen(ctx => !IsAllowedBrowser(ctx.Request), app2 =>
			{

				var config = new HttpConfiguration();

				config.SuppressDefaultHostAuthentication();
				config.SuppressHostPrincipal();
				config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType)); 
			}); 
		}
         
		private static bool IsApiRequest(IOwinRequest request)
		{
			string apiPath = VirtualPathUtility.ToAbsolute("~/api/");
			return request.Uri.LocalPath.StartsWith(apiPath);
		}

		private static bool IsAllowedBrowser(IOwinRequest request)
		{
			return true;
		}
         
	}


}