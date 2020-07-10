/*
 Service For Agent
Created by: Prashant
Created On: 10/07/2020
*/
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using MVC5BP.Model;
using MVC5BP.Model.ChaliseStoredProc;

namespace MVC5BP.Service
{
    public interface IAgentService : IEntityService<Agent>
    {
        Agent GetAgentById(int agentid);
        IEnumerable<AgentViewModel> GetAgent(string userId, AgentViewModel_Input input);
        void UpdateAgent(Agent agent, string actionType, string userId, ref int returnAgentId, ref string msgType, ref string msgText);
    }

    public class AgentService : EntityService<Agent>, IAgentService
    {

        new IContext _context;
        public AgentService(IContext context) : base(context)
        {
            _context = context;
            _dbset = _context.Set<Agent>();
        }

        //Stored Procedures definition 
        StoredProc csp_Agent_GET = new StoredProc().HasName("[csp.Agent.Get]").ReturnsTypes(typeof(AgentViewModel));
        StoredProc csp_Agent_UPDATE = new StoredProc().HasName("[csp.Agent.Update]");

        /// <summary>
        /// Get Agent By Id :: Don't forget to add the DBSet to RolpoContext
        /// </summary>

        public Agent GetAgentById(int agentid)
        {
            return _dbset.FirstOrDefault(x => x.AgentId == agentid);
        }

        /// <summary>
        /// Get Agent
        /// </summary>

        public IEnumerable<AgentViewModel> GetAgent(string userId, AgentViewModel_Input input)
        {

            SqlParameter[] p = new SqlParameter[6];

            p[0] = new SqlParameter("@AgentId", input.AgentId);
            p[1] = new SqlParameter("@AgentName", input.AgentName);

            p[2] = new SqlParameter("@UserId", userId);
            p[3] = new SqlParameter("@PageNumber", input.PageNumber);
            p[4] = new SqlParameter("@PageSize", input.PageSize);
            p[5] = new SqlParameter("@ShowAll", input.ShowAll);

            var results = _context.CallSP(csp_Agent_GET, p);
            return results.ToList<AgentViewModel>();
        }

        /// <summary>
        /// Update Agent
        /// </summary>

        public void UpdateAgent(Agent agent, string actionType, string userId, ref int returnAgentId, ref string msgType, ref string msgText)
        {

            SqlParameter[] p = new SqlParameter[16];

            p[0] = new SqlParameter("@ActionType", actionType);

            p[1] = new SqlParameter("@AgentId", agent.AgentId);
            p[2] = new SqlParameter("@OrganizationId", agent.OrganizationId);
            p[3] = new SqlParameter("@AgentName", agent.AgentName);
            p[4] = new SqlParameter("@AgentShortCode", agent.AgentShortCode);
            p[5] = new SqlParameter("@Address1", agent.Address1);
            p[6] = new SqlParameter("@Address2", agent.Address2);
            p[7] = new SqlParameter("@Phone1", agent.Phone1);
            p[8] = new SqlParameter("@Phone2", agent.Phone2);
            p[9] = new SqlParameter("@PrimaryContactEmail", agent.PrimaryContactEmail);
            p[10] = new SqlParameter("@TransactionCurrencyId", agent.TransactionCurrencyId);
            p[11] = new SqlParameter("@AgentInfo", agent.AgentInfo);

            p[12] = new SqlParameter("@UserId", userId);

            p[13] = new SqlParameter("@MsgType", System.Data.SqlDbType.VarChar, 20);
            p[13].Direction = System.Data.ParameterDirection.Output;

            p[14] = new SqlParameter("@MsgText", System.Data.SqlDbType.VarChar, 200);
            p[14].Direction = System.Data.ParameterDirection.Output;

            p[15] = new SqlParameter("@ReturnAgentId", System.Data.SqlDbType.Int);
            p[15].Direction = System.Data.ParameterDirection.Output;

            var result = _context.CallSP(csp_Agent_UPDATE, p);

            msgType = (string)p[13].Value;
            msgText = (string)p[14].Value;
            returnAgentId = (int)p[15].Value;
        }
    }
}
