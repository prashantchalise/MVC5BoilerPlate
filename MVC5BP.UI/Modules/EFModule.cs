using Autofac;
using MVC5BP.Model;

namespace MVC5BP.UI.Modules
{

    public class EFModule : Autofac.Module
    {

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType(typeof(RolpoContext)).As(typeof(IContext)).InstancePerLifetimeScope();
        }

    }


}

