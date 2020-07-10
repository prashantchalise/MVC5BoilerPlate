using Autofac;
using System.Linq;
using System.Reflection;

namespace MVC5BP.UI.Modules
{
	public class ServiceModule : Autofac.Module
	{

		protected override void Load(ContainerBuilder builder)
		{

			builder.RegisterAssemblyTypes(Assembly.Load("MVC5BP.Service"))

					  .Where(t => t.Name.EndsWith("Service"))

					  .AsImplementedInterfaces()

					  .InstancePerLifetimeScope();

		}

	}
}