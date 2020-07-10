/*
 Contoller For Agent
Created by: Prashant
Created On: 10/07/2020
*/

using MVC5BP.Model;
using MVC5BP.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.ModelBinding;

namespace MVC5BP.UI.Controllers.API
{
    /// <summary>
    ///  Agent Controller
    /// </summary>


     public class AgentController : ApiController
    {
        //initialize service object 
        IAgentService _agentService;
        //private readonly UserManager<ApplicationUser> _userManager;

        /// <summary>
        /// Constructor with DI
        /// </summary>

        public AgentController(
            IAgentService agentService
            //, UserManager<ApplicationUser> userManager
        )
        {
            _agentService = agentService;
            //_userManager = userManager;
        }

        #region API  

        /// <summary>
        /// Action: Get List of Agents
        /// </summary>

        [HttpPost, Route("api/Agent/GetAgentsList")]
        public IEnumerable<AgentViewModel> GetAgentsList([FromBody] AgentViewModel_Input input)
        {
            //var user = GetCurrentUser();
            string userId = "TestUserId";
            return _agentService.GetAgent(userId: userId
                , input: input);

        }

        /// <summary>
        /// Action: Get Agent by Id
        /// </summary>

        [HttpPost, Route("api/Agent/GetAgentById")]
        public AgentViewModel GetAgentById([FromBody] int agentid)
        {
            string userId = "TestUserId"; 

            var input = new AgentViewModel_Input() { AgentId = agentid, PageNumber = 1, PageSize = 1, ShowAll = 0 };

            var result = _agentService.GetAgent(
            userId: userId, input: input).FirstOrDefault();

            return result;
        }

        /// <summary>
        /// Action: Add Agent
        /// </summary>

        [HttpPost, Route("api/Agent/SaveAgent")]
        public IHttpActionResult SaveAgent([FromBody] Agent agent)
        {
            string msgType = "", msgText = "", actionType = "ADD";
            int AgentId = 0;
            //var user = GetCurrentUser();

            if (!ModelState.IsValid)
            { return BadRequest(ModelState); }

            try
            {
                string userId = "TestUserId";
                //Set OrganizationId  
                agent.OrganizationId = new Guid();  //user.OrganizationId;
                _agentService.UpdateAgent(agent: agent, actionType: actionType, userId: userId, msgType: ref msgType, msgText: ref msgText, returnAgentId: ref AgentId);
            }
            catch (Exception e)
            {
                var modelStateDictionary = new ModelStateDictionary();
                if (e.InnerException != null)
                    modelStateDictionary.AddModelError("InnerException", e.InnerException.Message);
                else
                    modelStateDictionary.AddModelError("InnerException", e.Message);
                return BadRequest(modelStateDictionary);
            }

            if (msgType == "ERROR")
            {
                var modelStateDictionary = new ModelStateDictionary();
                modelStateDictionary.AddModelError("InnerException", msgText);
                return BadRequest(modelStateDictionary);
            }

            var input = new AgentViewModel_Input() { AgentId = AgentId, PageNumber = 1, PageSize = 1, ShowAll = 0 };

            return Ok(_agentService.GetAgent(
            userId: "", input: input).FirstOrDefault());
        }

        /// <summary>
        /// Action: Update Agent
        /// </summary>

        [HttpPost, Route("api/Agent/UpdateAgent")]
        public IHttpActionResult UpdateAgent([FromBody] Agent agent)
        {
            string msgType = "", msgText = "", actionType = "UPDATE";
            int AgentId = 0;
            //var user = GetCurrentUser();

            if (!ModelState.IsValid)
            { return BadRequest(ModelState); }

            try
            {
                string userId = "TestUserId";
                //Set OrganizationId  
                agent.OrganizationId = new Guid();  //user.OrganizationId;
                _agentService.UpdateAgent(agent: agent, actionType: actionType, userId: userId, msgType: ref msgType, msgText: ref msgText, returnAgentId: ref AgentId);
            }
            catch (Exception e)
            {
                var modelStateDictionary = new ModelStateDictionary();
                if (e.InnerException != null)
                    modelStateDictionary.AddModelError("InnerException", e.InnerException.Message);
                else
                    modelStateDictionary.AddModelError("InnerException", e.Message);
                return BadRequest(modelStateDictionary);
            }

            if (msgType == "ERROR")
            {
                var modelStateDictionary = new ModelStateDictionary();
                modelStateDictionary.AddModelError("InnerException", msgText);
                return BadRequest(modelStateDictionary);
            }

            var input = new AgentViewModel_Input() { AgentId = AgentId, PageNumber = 1, PageSize = 1, ShowAll = 0 };

            return Ok(_agentService.GetAgent(
            userId: "", input: input).FirstOrDefault());
        }

        /// <summary>
        /// Action: Delete Agent
        /// </summary>

        [HttpDelete, Route("api/Agent/DeleteAgent/{agentid}")]
        public IHttpActionResult DeleteAgent(int agentid)
        {
            Agent agent = _agentService.GetAgentById(agentid);
            if (agent == null)
            { return NotFound(); }
            try { _agentService.Delete(agent); }
            catch (Exception e)
            {
                var modelStateDictionary = new ModelStateDictionary();
                if (e.InnerException != null)
                    modelStateDictionary.AddModelError("InnerException", e.InnerException.Message);
                else
                    modelStateDictionary.AddModelError("InnerException", e.Message);
                return BadRequest(modelStateDictionary);
            }

            return Ok();
        }

        #endregion

      
    }
}
