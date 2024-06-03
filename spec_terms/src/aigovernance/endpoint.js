//const BASE_URL = "http://localhost:5011/node-api/";
const BASE_URL = "https://staging.apilayer.valuevalidator.com/node-api/";

/*********Algorithm Inventory***************
 *
 *
 */

export const GET_SPECIFIC_ALGORITHM_INVENTORY = (projectcode) =>
  `${BASE_URL}api/algorithminventoryget/${projectcode}`;

export const ADD_ALGORITHM_INVENTORY = `${BASE_URL}api/algorithminventorypost`;
export const UPDATE_ALGORITHM_INVENTORY = (algorithminventoryid) =>
  `${BASE_URL}api/algorithminventoryupdate/${algorithminventoryid}   `;
export const GET_ALGORITHM_INVENTORY = `${BASE_URL}api/algorithminventoryget`;
export const DELETE_ALGORITHM_INVENTORY = (algorithminventoryid) =>
  `${BASE_URL}api/algorithminventorydelete/${algorithminventoryid}`;
export const GET_GRAPH_ALGORITHMINVENTORY = (projectcode) =>
  `${BASE_URL}api/algorithminventoryget/graph/${projectcode}`;
export const GET_ALGORITHMINVENTORY_BYID = (algorithminventoryid) =>
  `${BASE_URL}api/algorithminventorygetid/${algorithminventoryid}`;
export const GET_ALGORITHMINVENTORY_PROJECTCODE = (projectcode) =>
  `${BASE_URL}api/algorithminventorygetcode/${projectcode}`;

/*
 *
 ****EVIDENCE*******
 *
 *
 */
export const GET_SPECIFIC_EVIDENCE = (resultid) =>
  `${BASE_URL}specificGovernanceget/api/${resultid}`;
export const ADD_EVIDENCE_API = (projectid, companyid) =>
  `${BASE_URL}evidence/${projectid}/${companyid}`;
export const EDIT_EVIDENCE_API = (resultid) =>
  `${BASE_URL}evidenceEdit/${resultid}`;
export const GET_EVIDENCE_API = (projectid, companyid) =>
  `${BASE_URL}getEvidences/${projectid}/${companyid}`;
export const DELETE_EVIDENCE_API = (resultid) =>
  `${BASE_URL}evidenceremove/${resultid}`;
export const GET_RESULT_EVIDENCE = (resultid) =>
  `${BASE_URL}getEvidence/${resultid}`;
/****THRUST AREA************
 
*/
export const GET_THRUST_AREA = `${BASE_URL}thrustarea/api`;
export const GET_SPECIFIC_THRUST = (thrustid) =>
  `${BASE_URL}specificthrustarea/api/${thrustid}`;
export const ADD_THRUSTAREA_API = `${BASE_URL}addthrustarea/api`;
export const UPDATE_THRUST_AREA = (thrustid) =>
  `${BASE_URL}thrustareaupdate/api/${thrustid}`;
export const DELETE_THRUST_AREA = (thrustid) =>
  `${BASE_URL}removethrustarea/${thrustid}`;
/**
 *
 *
 * ****************Company***************
 * ** */
export const GET_COMPANY_API = `${BASE_URL}companyget/api`;
export const GET_DISTINCTCOMPANY_API = `${BASE_URL}getdistinctcompany/api`;
export const DELETE_COMPANY_API = (companyid) =>
  `${BASE_URL}companyremove/api/${companyid}`;
export const GET_SPECIFIC_COMPANY = (companyid) =>
  `${BASE_URL}companyget/api/${companyid}`;
export const ADD_COMPANY_API = `${BASE_URL}companyadd/api/`;
export const UPDATE_COMPANY_API = (companyid) =>
  `${BASE_URL}updatecompany/api/${companyid}`;
/**
 *
 *
 * ********Project*********** */
export const GET_PROJECT_API = `${BASE_URL}projectgetapi`;
export const GET_DISTINCTPROJECT_API = `${BASE_URL}getdistinctproject`;
export const GET_PROJECTNAME_API = `${BASE_URL}getprojectnames/api`;
export const GET_SPECIFIC_PROJECT = (projectid) =>
  `${BASE_URL}specificproject/${projectid}`;
export const GET_SPECIFIC_PROJECTNAME = (projectid) =>
  `${BASE_URL}namespecificproject/${projectid}`;
export const GET_COMPANYSPECIFIC_PROJECT = (companyid) =>
  `${BASE_URL}projectgetApi/${companyid}`;
export const GET_COMPANY_PROJECT = (projectid, companyid) =>
  `${BASE_URL}projectApiGet/${projectid}/${companyid}`;
export const ADD_PROJECT_API = (companyid) =>
  `${BASE_URL}projectadd/api/${companyid}`;
export const UPDATE_COMPANY_PROJECT = (projectid, companyid) =>
  `${BASE_URL}projectUpdate/api/${projectid}/${companyid}`;
export const DELETE_PROJECT_API = (projectid) =>
  `${BASE_URL}projectRemove/${projectid}`;

/*  *
 *
 *
 * **************Responsibility Group**** */
export const GET_RESPONSIBILITY_GROUP = `${BASE_URL}api/in`;
export const GET_RESPONSIBILITY_CENTER = `${BASE_URL}api/getresponsibilitycenter`;
/*
 *
 * ***SUB CONTROL****** */
export const GET_SUBCONTROL_API = `${BASE_URL}getGovernancesubcontrol/api`;
export const GET_DISTINCT_THRUSTAREA = `${BASE_URL}getGovernancethrustarea/api`;

export const GET_SPECIFIC_SUBCONTROL = (subcontrolid) =>
  `${BASE_URL}getGovernancesubcontrol/api/${subcontrolid}`;
export const ADD_SUBCONTROL_API = `${BASE_URL}add/Governancesubcontrol/api`;
export const UPDATE_SUBCONTROL_API = (subcontrolid) =>
  `${BASE_URL}updateGovernancesubcontrol/api/${subcontrolid}`;
export const DELETE_SUBCONTROL_API = (subcontrolid) =>
  `${BASE_URL}removeGovernancesubcontrol/api/${subcontrolid}`;
export const GET_GROUPNAME_SUBCONTROL = (groupname) =>
  `${BASE_URL}getGroupnamesubcontrol/api?groupname=${groupname}`;
export const GET_THRUST_SUBCONTROL = (thrustarea) =>
  `${BASE_URL}getthrustsubcontrol/api?thrustarea=${thrustarea}`;

/**
 *
 *
 ******GOVERNANCE CONTROL************/
export const GET_CONTROL_API = `${BASE_URL}controlGovernance/api`;
export const GET_SPECIFIC_CONTROL = (controlid) =>
  `${BASE_URL}controlGovernanceget/api/${controlid}`;
export const UPDATE_CONTROL_API = (controlid) =>
  `${BASE_URL}controlGovernanceUpdate/api/${controlid}`;
export const ADD_CONTROL_API = `${BASE_URL}governanceAddcontrol/api`;
export const DELETE_CONTROL_API = (controlid) =>
  `${BASE_URL}controlGovernanceRemove/${controlid}`;
export const LOAD_EXCEL_API = `${BASE_URL}loadExcel/api`;
/**
 *
 ***********GOVERNANCE GROUP*************/
export const GET_GROUP_API = `${BASE_URL}GovernanceGroupget/api`;
export const GET_SPECIFIC_GROUP = (groupid) =>
  `${BASE_URL}GovernanceGroupget/api/${groupid}`;
export const ADD_GROUP_API = `${BASE_URL}GovernanceGroupadd/api`;
export const UPDATE_GROUP_API = (groupid) =>
  `${BASE_URL}GovernanceGroupupdate/api/${groupid}`;
export const DELETE_GROUP_API = (groupid) =>
  `GovernanceGroupremove/api/${groupid}`;

/**
 *
 **********ASSESSMENTS***********/
export const GET_PROJECT_ASSESSMENTS = (projectid) =>
  `${BASE_URL}getassessment/${projectid}`;
export const GET_ASSESSMENTS = (resultid) =>
  `${BASE_URL}getassessment/${resultid}`;
export const ADD_ASSESSMENT_API = (projectid, companyid) =>
  `${BASE_URL}addassessment/${projectid}/${companyid}`;
export const UPDATE_ASSESSMENTS_API = (resultid) =>
  `${BASE_URL}resulttestGovernmentUpdate/api/${resultid}`;
/**
 *
 ****************PROJECT AUDITPLAN************************/
export const GET_SPECIFIC_AUDITPLAN = (auditid) =>
  `${BASE_URL}specificaudit/api/${auditid}`;
export const ADD_PROJECTAUDIT_API = (resultid) =>
  `${BASE_URL}addaudit/${resultid}`;
export const ADD_AUDITPLAN_API = (projectid, companyid, resultid) =>
  `${BASE_URL}addprojectaudit/api/${projectid}/${companyid}/${resultid}`;
export const UPDATE_AUDITPLAN_API = (auditid) =>
  `${BASE_URL}updateprojectaudit/api/${auditid}`;
export const GET_AUDITPLAN_API = `${BASE_URL}getaudit/api`;
export const GET_RESULT_AUDITPLAN = (resultid) =>
  `${BASE_URL}audit/api/${resultid}`;
export const DELETE_AUDITPLAN_API = (auditid) =>
  `${BASE_URL}removeauditapi/${auditid}`;
/**
 DIRECT AUDITPLAN* 
 * 
 */
export const ADD_DIRECT_AUDIT = `${BASE_URL}directaddprojectaudit/api`;
/************PROJECT AUDIT**************** */
export const UPDATE_PROJECTAUDIT_API = (resultid) =>
  `${BASE_URL}resulttestGovernanceUpdate/api/${resultid}`;
export const GET_SPECIFIC_PROJECTAUDIT = (resultid) =>
  `${BASE_URL}resultspecificGovernanceget/api/${resultid}`;
export const ADD_SPECIFIC_PROJECTAUDIT = (resultid) =>
  `${BASE_URL}addaudit/${resultid}`;
/**
 *
 * ********PROJECT PHASE**************
 */
export const GET_SPECIFIC_PHASE = (phaseid) =>
  `${BASE_URL}get/api/projectphase/${phaseid}`;
export const GET_PHASE_API = `${BASE_URL}get/api/projectphase`;
export const DELETE_PHASE_API = (phaseid) =>
  `${BASE_URL}remove/api/projectphase/${phaseid}`;
export const ADD_PHASE_API = `${BASE_URL}post/api/projectphase`;
export const UPDATE_PHASE_API = (phaseid) =>
  `${BASE_URL}update/api/projectphase/${phaseid}`;
/**********
 *
 *
 **********************DATA LINEAGE*************************************/
export const GET_DATALINEAGE_API = `${BASE_URL}api/datalineageget`;

export const ADD_DATALINEAGE_API = `${BASE_URL}datalineagepost/api`;

export const GET_DATA_LINEAGE = (
  organization,
  projectname,
  responsibilitygroup,
  responsibilitycenter,
  objecttype,
  objectcode
) =>
  `${BASE_URL}getdatalineage?organization=${organization}&projectname=${projectname}&responsibilitygroup=${responsibilitygroup}&responsibilitycenter=${responsibilitycenter}&objecttype=${objecttype}&objectcode=${objectcode}`;

// Assuming BASE_URL is defined in your endpoint module
export const DELETE_DATALINEAGE_API = (datalineageid) =>
  `${BASE_URL}api/datalineagedelete/${datalineageid}`;

export const VIEW_EVIDENCE_API = (datalineageid) =>
  `${BASE_URL}api/datalineageget/${datalineageid}`;

export const UPDATE_EVIDENCE_API = (datalineageid) =>
  `${BASE_URL}api/datalineageupdate/${datalineageid}`;

export const GET_COMPANYPROJECT_API = `${BASE_URL}api/companyprojectget`;
/*********************************
 *
 ***********GET OBJECT************/

export const GET_OBJECTTYPE_API = `${BASE_URL}api/getObjecttype`;
export const OBJECTGET_OBJECTNAME_API = `${BASE_URL}api/Objectname`;
export const COMPANY_PROJECT_API = `${BASE_URL}api/companyprojectget`;

export const GET_DISTINCTOBJECTNAME_API = `${BASE_URL}api/Objectname`;
/************Miscellenious****************** */
export const GET_RISKSEVERIT_API = `${BASE_URL}api/riskseverityget`;

/*-----------------------------------theme master---------------------------------------*/
export const GET_THEMEMASTER_API = `${BASE_URL}api/thememasterget`;

export const ADD_THEMEMASTER_API = `${BASE_URL}api/thememasterpost`;

export const DELETE_THEMEMASTER_API = (thememasterid) =>
  `${BASE_URL}api/thememasterdelete/${thememasterid}`;

export const VIEW_THEMEMASTER_API = (thememasterid) =>
  `${BASE_URL}api/thememasterget/${thememasterid}`;

export const UPDATE_THEMEMASTER_API = (thememasterid) =>
  `${BASE_URL}api/thememasterupdate/${thememasterid}`;

/*-----------------------------------activity Group---------------------------------------*/
export const GET_ACTIVITYGROUP_API = `${BASE_URL}api/activitygroupget`;

export const ADD_ACTIVITYGROUP_API = `${BASE_URL}api/activitygrouppost`;

export const DELETE_ACTIVITYGROUP_API = (activitygroupid) =>
  `${BASE_URL}api/activitygroupdelete/${activitygroupid}`;

export const VIEW_ACTIVITYGROUP_API = (activitygroupid) =>
  `${BASE_URL}api/activitygroupget/${activitygroupid}`;

export const UPDATE_ACTIVITYGROUP_API = (activitygroupid) =>
  `${BASE_URL}api/activitygroupupdate/${activitygroupid}`;

/*-----------------------------------Theme Activity---------------------------------------*/

export const GET_THEMEACTIVITY_API = `${BASE_URL}api/themeactivityget`;

export const ADD_THEMEACTIVITY_API = ` ${BASE_URL}api/themeactivitypost`;

export const DELETE_THEMEACTIVITY_API = (themeactivityid) =>
  `${BASE_URL}api/themeactivitydelete/${themeactivityid}`;

export const VIEW_THEMEACTIVITY_API = (themeactivityid) =>
  `${BASE_URL}api/themeactivityget/${themeactivityid}`;

export const UPDATE_THEMEACTIVITY_API = (themeactivityid) =>
  `${BASE_URL}api/themeactivityupdate/${themeactivityid}`;

export const API_THEMEACTIVITY_GET = `${BASE_URL}api/getthemeactivity`;
export const API_THEME_GET = (themename) =>
  `${BASE_URL}api/getphaseactivity/${themename}`;
export const THEMEACTIVITY_THEME_API = (theme) =>
  `${BASE_URL}api/themeactivity/${theme}`;

/*-----------------------------------Vendor Master---------------------------------------*/

export const GET_VENDORMASTER_API = `${BASE_URL}api/vendormasterget`;

export const ADD_VENDORMASTER_API = `${BASE_URL}api/vendormasterpost`;

export const DELETE_VENDORMASTER_API = (vendorid) =>
  `${BASE_URL}api/vendormasterdelete/${vendorid}`;

export const VIEW_VENDORMASTER_API = (vendorid) =>
  `${BASE_URL}api/vendormasterget/${vendorid}`;

export const UPDATE_VENDORMASTER_API = (vendorid) =>
  `${BASE_URL}api/vendormasterupdate/${vendorid}`;

/*-----------------------------------Technology---------------------------------------*/
export const GET_TECHNOLOGY_API = `${BASE_URL}api/technologyget`;

export const ADD_TECHNOLOGY_API = `${BASE_URL}api/technologypost`;

export const DELETE_TECHNOLOGY_API = (technologymasterid) =>
  `${BASE_URL}api/technologydelete/${technologymasterid}`;

export const VIEW_TECHNOLOGY_API = (technologymasterid) =>
  `${BASE_URL}api/technologyget/${technologymasterid}`;

export const UPDATE_TECHNOLOGY_API = (technologymasterid) =>
  `${BASE_URL}api/technologyupdate/${technologymasterid}`;

/*-----------------------------------vulnerability---------------------------------------*/
export const GET_VULNERABILITY_API = `${BASE_URL}api/vulnerabilityget`;

export const ADD_VULNERABILITY_API = `${BASE_URL}api/vulnerabilitypost`;

export const DELETE_VULNERABILITY_API = (vulnerabilityid) =>
  `${BASE_URL}api/vulnerabilitydelete/${vulnerabilityid}`;

export const VIEW_VULNERABILITY_API = (vulnerabilityid) =>
  `${BASE_URL}api/vulnerabilityget/${vulnerabilityid}`;

export const UPDATE_VULNERABILITY_API = (vulnerabilityid) =>
  `${BASE_URL}api/vulnerabilityupdate/${vulnerabilityid}`;

/*-----------------------------------Resource---------------------------------------*/

export const GET_RESOURCE_API = `${BASE_URL}api/resourceget`;

export const ADD_RESOURCE_API = `${BASE_URL}api/resourcepost`;

export const ALLOCATE_RESOURCE_API = `${BASE_URL}api/resourceallocation`;

export const DELETE_RESOURCE_API = (resourceid) =>
  `${BASE_URL}api/resourcedelete/${resourceid}`;
export const DELETE_ALLOCATEDRESOURCE_API = (resourceid) =>
  `${BASE_URL}/delete/allocatedresource/${resourceid}`;

export const VIEW_RESOURCE_API = (resourceid) =>
  `${BASE_URL}api/resourceget/${resourceid}`;

export const UPDATE_RESOURCE_API = (resourceid) =>
  `${BASE_URL}api/resourceupdate/${resourceid}`;

/****************REsource Allocation******************* */

export const GET_RESOURCES_BY_DESIGNATION = (designation) =>
  `${BASE_URL}api/resourcedesignation/${designation}`;

export const GET_DESIGNATION_API = `${BASE_URL}api/getresourcedesignation`;

export const GET_ALLOCATEDRESOURCE_API = (projectid) =>
  `${BASE_URL}api/getallocatedresource/${projectid}`;

export const GET_RESOURCEMASTER_API = (resourceid) =>
  `${BASE_URL}api/resourcemaster/${resourceid}`;

/***************************DATA SET*************************************** */
export const GET_DATASET_API = `${BASE_URL}api/datasetget`;

export const ADD_DATASET_API = `${BASE_URL}api/datasetpost`;

export const DELETE_DATASET_API = (datasetid) =>
  `${BASE_URL}api/datasetdelete/${datasetid}`;

export const VIEW_DATASET_API = (datasetid) =>
  `${BASE_URL}api/dataset/${datasetid}`;

export const UPDATE_DATASET_API = (datasetid) =>
  `${BASE_URL}api/datasetupdate/${datasetid}`;

/***********************Checklist********************************************* */
export const GET_CHECKLIST_API = `${BASE_URL}api/checklist`;
export const ADD_CHECKLIST_API = (algorithminventoryid) =>
  `${BASE_URL}api/addchecklist/${algorithminventoryid}`;
export const GET_SPECIFIC_CHECKLIST = (algorithminventoryid) =>
  `${BASE_URL}api/checklist/${algorithminventoryid}`;
export const DELETE_CHECKLIST_API = (checklistid) =>
  `${BASE_URL}api/removechecklist/${checklistid}`;
/************************************************ */

export const GET_SCORECARD_API = `${BASE_URL}api/scorecard`;
export const GET_GOVERNANCE_API = `${BASE_URL}resultGovernanceget/api`;
export const GETGROUPNAME_GOVERNANCE_API = (groupname) =>
  `${BASE_URL}api/groupnameget/${groupname}`;
/*************************************** */
export const GET_MULTIPLEGRAPH_API = `${BASE_URL}api/governancemultigraph`;
/****************************************** */

export const VIEW_GOVERNANCE_API = (projectid, companyid) =>
  `${BASE_URL}api/evidence/${projectid},/${companyid}`;

export const COUNT_GOVERNANCE_API = (resultid) =>
  `${BASE_URL}resultGovernanceget/api/${resultid}`;

export const GROUPNAME_GOVERNANCE_API = `${BASE_URL}api/groupname`;

export const THRUSTAREA_GOVERNANCE_API = (groupname) =>
  `${BASE_URL}api/thrustareagraph/${groupname}`;

export const CONTROLNAMEGRAPH_GOVERNANCE_API = (thrustarea) =>
  `${BASE_URL}api/controlnamegraph/${thrustarea}`;

export const SUBCONTROLNAMEGRAPH_GOVERNANCE_API = (subcontrolname) =>
  `${BASE_URL}api/subcontrolnamegraph/${subcontrolname}`;

export const AEESESSMENTSTATUSGRAPH_GOVERNANCE_API = (controlname) =>
  `${BASE_URL}api/assessmentstatusgraph/${controlname}`;

export const AUDITSTATUSGRAPH_GOVERNANCE_API = (assessmentstatus) =>
  `${BASE_URL}api/auditstatusgraph/${assessmentstatus}`;

/*-----------------------------------Environment---------------------------------------*/
export const GET_ENVIRONMENT_API = `${BASE_URL}api/environmentget`;

export const ADD_ENVIRONMENT_API = `${BASE_URL}api/environmentpost`;

export const DELETE_ENVIRONMENT_API = (environmentid) =>
  `${BASE_URL}api/environmentdelete/${environmentid}`;

export const VIEW_ENVIRONMENT_API = (environmentid) =>
  `${BASE_URL}api/environmentset/${environmentid}`;

export const UPDATE_ENVIRONMENT_API = (environmentid) =>
  `${BASE_URL}api/environmentupdate/${environmentid}`;

/*-----------------------------------Environment  Type---------------------------------------*/
export const GET_ENVIRONMENTTYPE_API = `${BASE_URL}api/environmenttypeget`;

export const ADD_ENVIRONMENTTYPE_API = `${BASE_URL}api/environmenttypepost`;

export const DELETE_ENVIRONMENTTYPE_API = (environmenttypeid) =>
  `${BASE_URL}api/environmenttypedelete/${environmenttypeid}`;

export const VIEW_ENVIRONMENTTYPE_API = (environmenttypeid) =>
  `${BASE_URL}api/environmenttypeset/${environmenttypeid}`;

export const UPDATE_ENVIRONMENTTYPE_API = (environmenttypeid) =>
  `${BASE_URL}api/environmenttypeupdate/${environmenttypeid}`;

/*---------------------Issue-------------------------------------*/
export const GET_ISSUE_API = `${BASE_URL}api/issueget`;
export const ADD_ISSUE_API = (algorithminventoryid) =>
  `${BASE_URL}api/issuepost/${algorithminventoryid}`;
export const DELETE_ISSUE_API = (issueid) =>
  `${BASE_URL}api/issuedelete/${issueid}`;
export const GET_SPECIFIC_ISSUE = (issueid) =>
  `${BASE_URL}api/issueget/${issueid}`;
export const UPDATE_ISSUE_API = (algorithminventoryid, issueid) =>
  `${BASE_URL}api/issueupdate/${algorithminventoryid}/${issueid}`;
export const GET_AIISSUE_API = (algorithminventoryid) =>
  `${BASE_URL}api/issuegetAI/${algorithminventoryid}`;

/*****************NMap************************ */
export const GET_NMAP_DETAILS = `${BASE_URL}api/nmap-scan`;

/*********************DashBoard*******************/
export const GET_DASHBOARD_API = `${BASE_URL}api/dashboard`;
export const GET_DASHBOARDDETAIL_API = `${BASE_URL}api/dashboard/detail`;
