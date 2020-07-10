//Created By: Prashant 
//Created On: 10/07/2020 
// Controller for Agent 
// Initialization for Agent 

rolpo_app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'rolpo.com'
});

// Service For Agent 
; (function () {
    'use strict';
    rolpo_app.factory('agentService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

        var serviceBase = ngAuthSettings.apiServiceBaseUri;
        var agentServiceFactory = {};

        //Default Filter 
        var _defaultDDLFilter = function () {
            return {
                PageName: "AddEditAgent",
                FilterList: [
                ]
            };
        };

        //Agent Empty Filter 
        var _agentEmptyFilter = function () {
            return {
                AgentId: 0,
                AgentName: "",
                PageNumber: 1,
                PageSize: 20,
                ShowAll: 0
            };
        };

        // Get DDL List by Filter
        var _getDDLList = function (ddlFilter) {
            return $http({
                url: serviceBase + 'api/Home/LoadDDLs',
                method: "post",
                data: ddlFilter
            });
        };

        // Get Agents by Filter
        var _getAgents = function (tbfilter) {
            return $http({
                url: serviceBase + 'api/Agent/GetAgentsList',
                method: "post",
                data: tbfilter
            });
        };

        //Create New Agent
        var _createAgent = function (agent) {
            var request = $http({
                method: 'post',
                url: serviceBase + 'api/Agent/SaveAgent',
                data: agent
            });
            return request;
        };

        //Update Agent 
        var _updateAgent = function (agent) {
            var request = $http({
                method: "post",
                url: serviceBase + "api/Agent/UpdateAgent",
                data: agent
            });
            return request;
        };

        //Delete Agent
        var _deleteAgent = function (agentid) {
            var request = $http({
                method: "delete",
                url: serviceBase + "api/Agent/DeleteAgent/" + agentid
            });
            return request;
        };

        agentServiceFactory.DDLDefaultFilter = _defaultDDLFilter;
        agentServiceFactory.GetDDLByFilter = _getDDLList;
        agentServiceFactory.getAgents = _getAgents;
        agentServiceFactory.createAgent = _createAgent;
        agentServiceFactory.updateAgent = _updateAgent;
        agentServiceFactory.deleteAgent = _deleteAgent;
        agentServiceFactory.AgentEmptyFilter = _agentEmptyFilter;

        return agentServiceFactory;
    }]);
}());


// Controller Starts Here.. 
; (function () {
    'use strict';
    rolpo_app.controller('agentController', ['$scope', '$rootScope', 'agentService', 'modalService', '$uibModal', '$uibModalStack', '$filter', function ($scope, $rootScope, agentService, modalService, $uibModal, $uibModalStack, $filter) {

        // Variables and declarations 

        $scope.loading = true;
        $scope.agents = [];
        $scope.agent = {};
        $scope.AgentPageInfo = {};

        ////Populate DDLs
        //var ddlFilter = agentService.DDLDefaultFilter();
        //agentService.GetDDLByFilter(ddlFilter).then(function (results) {
        //    $scope.ddLItems = angular.fromJson(results.data.DDLItems);

        //});

        // Methods

        // Get Agent by Filter

        $scope.GetAgentByFilter = function () {
            GetAgents($scope.tbfilter);
        };

        // Reset Agent Filter
        $scope.ResetAgentFilter = function () {
            var pageSize = $scope.tbfilter.PageSize;

            $scope.tbfilter = agentService.AgentEmptyFilter();
            $scope.tbfilter.PageSize = pageSize;

            GetAgents($scope.tbfilter);
        };

        //On Agent Page Changed
        $scope.OnAgentPageChanged = function () {
            GetAgents($scope.tbfilter);
        };

        //On Page Size Changed
        $scope.OnAgentPageSizeChanged = function () {
            GetAgents($scope.tbfilter);
        };

        // Open Window for Saving new Agent
        $scope.OpenAgentSaveDialog = function () {
            $scope.agent = { AgentId: 0 };
            MSG({}); //Init
            $scope.agentActionTitle = "Add New Agent";
            var modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                templateUrl: 'customUpdateAgent',
                backdrop: 'static',
                keyboard: false,
                modalFade: true,
                size: ''
            });

        };

        // Open Window for updating Agent
        $scope.OpenAgentUpdateDialog = function (AgentId) {
            var tbfilter = agentService.AgentEmptyFilter();
            tbfilter.AgentId = AgentId;
            $scope.loading = true;
            MSG({}); //Init

            agentService.getAgents(tbfilter).then(function (results) {
                if (results.data.length != 1) {
                    $scope.loading = false;
                    MSG({ 'elm': "Agent_alert", 'MsgType': 'ERROR', 'MsgText': 'An Error has occured while loading agents!', 'MsgAsModel': error.data });
                    return;
                }
                $scope.agent = results.data[0];
                $scope.agentActionTitle = "Update Agent";

                var modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: 'customUpdateAgent',
                    backdrop: 'static',
                    keyboard: false,
                    modalFade: true,
                    size: ''
                });
                $scope.loading = false;
            }, function (error) {
                MSG({ 'elm': "Agent_alert", 'MsgType': 'ERROR', 'MsgText': 'An Error has occured while loading agents!', 'MsgAsModel': error.data });
                $scope.loading = false;
            });

        };

        //Update Agent
        $scope.CreateUpdateAgent = function (frm, AgentId) {
            if (frm.$invalid) { return; }
            if (AgentId == 0) { CreateNewAgent($scope.agent); } else { UpdateAgent($scope.agent); }
        };

        //Delete Agent
        $scope.DeleteAgent = function (AgentId) {
            MSG({}); //Init
            var modalOptions = {
                closeButtonText: 'Cancel',
                actionButtonText: 'Delete Agent',
                headerText: 'Delete Item',
                bodyText: 'Are you sure you want to delete this?'
            };
            modalService.showModal({}, modalOptions).then(function (result) {
                $scope.loading = true;
                agentService.deleteAgent(AgentId).then(function (results) {
                    angular.forEach($scope.agents, function (value, key) {
                        if ($scope.agents[key].AgentId === AgentId) {
                            $scope.agents.splice(key, 1);
                            return false;
                        }
                    });

                    $scope.loading = false;
                    MSG({ 'elm': "Agent_alert", "MsgType": "OK", "MsgText": "Agent deleted successfully." });
                }, function (error) {
                    MSG({ 'elm': "Agent_alert", 'MsgType': 'ERROR', 'MsgText': 'An Error has occured while deleting agents!', 'MsgAsModel': error.data });
                    $scope.loading = false;
                });
            });
        };

        // Cancel  Editing
        $scope.cancelEditing = function () {
            $uibModalStack.dismissAll();
        };

        // Functions 

        // Function to Get Agent
        function GetAgents(tbfilter) {
            $scope.loading = true;
            $scope.HasTB_Records = false;
            agentService.getAgents(tbfilter).then(function (results) {
                $scope.agents = results.data;
                var tmp_page_start = (($scope.tbfilter.PageNumber - 1) * ($scope.tbfilter.PageSize) + 1), tmp_page_end = ($scope.tbfilter.PageNumber) * ($scope.tbfilter.PageSize);
                if (results.data.length > 0) {
                    $scope.AgentPageInfo = {
                        Has_record: true,
                        TotalItems: results.data[0]["TotalCount"],
                        PageStart: (results.data[0]["TotalCount"] > 0) ? tmp_page_start : 0,
                        PageEnd: tmp_page_end < results.data[0]["TotalCount"] ? tmp_page_end : results.data[0]["TotalCount"]
                    };
                } else { $scope.AgentPageInfo = {}; }
                $scope.loading = false;
            }, function (error) {
                MSG({ 'elm': "Agent_alert", 'MsgType': 'ERROR', 'MsgText': 'An Error has occured while loading agents!', 'MsgAsModel': error.data });
                $scope.loading = false;
            });
        };

        // Create New Agent Function 
        function CreateNewAgent(agent) {
            $scope.agent_loading = true;
            agentService.createAgent(agent).then(function (results) {
                $scope.agents.push(results.data);
                $scope.agent_loading = false;
                $uibModalStack.dismissAll();
                MSG({ 'elm': "Agent_alert", "MsgType": "OK", "MsgText": "Agent added successfully." });
            }, function (error) {
                MSG({ 'elm': "Agent_AddEditAlert", 'MsgType': 'ERROR', 'MsgText': 'An error has occured while adding agent!', 'MsgAsModel': error.data });
                $scope.agent_loading = false;
            });
        }

        //Update Agent Function 
        function UpdateAgent(agent) {
            $scope.agent_loading = true;
            agentService.updateAgent(agent).then(function (results) {
                angular.forEach($scope.agents, function (value, key) {
                    if ($scope.agents[key].AgentId === agent.AgentId) {
                        $scope.agents[key] = agent;
                        return false;
                    }
                });
                $scope.agent_loading = false;
                $uibModalStack.dismissAll();
                MSG({ 'elm': "Agent_alert", "MsgType": "OK", "MsgText": "Agent updated successfully." });
            }, function (error) {
                MSG({ 'elm': "Agent_AddEditAlert", 'MsgType': 'ERROR', 'MsgText': 'An error has occured while updating agent!', 'MsgAsModel': error.data });
                $scope.agent_loading = false;
            });
        };

        //Datepicker
        $scope.dateOptions = {
            'year-format': "'yy'",
            'show-weeks': false
        };

        $scope.OpenDate = function (obj, prop) {
            obj[prop] = true;
        };

        // Call Agent for first time
        $scope.AgentPageInfo = {};
        $scope.tbfilter = agentService.AgentEmptyFilter();
        $scope.tbfilter.PageNumber = 1;
        $scope.tbfilter.PageSize = '20';

        GetAgents($scope.tbfilter);

    }]);
}());

