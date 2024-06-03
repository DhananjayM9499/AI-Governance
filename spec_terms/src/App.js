import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
/***********************Dashoard*********** */
//import DashBoardTable from "./aigovernance/dashboard/DashBoardTable";
/****************Term Sets and Terms***********************/
import AddEdit from "./aigovernance/pages/AddEdit";
import View from "./aigovernance/pages/View";
import AddEditTerms from "./aigovernance/pages/AddEditTerms";
/**************Project phases******************************************* */
import Project from "./aigovernance/projectphase/Project";
import AddEditProjectPhase from "./aigovernance/projectphase/AddEditProjectPhase";
import ProjectView from "./aigovernance/projectphase/ProjectView";
/******************Governance Sub-Control*************************************** */
import Governancesubcontrol from "./aigovernance/governancesubcontrol/Governancesubcontrol";
import AddEditGS from "./aigovernance/governancesubcontrol/AddEditGS";
import GovernancesubcontrolView from "./aigovernance/governancesubcontrol/GovernancesubcontrolView";
/******************Governance Group*************************************** */
import Governancegroup from "./aigovernance/governancegroup/Governancegroup";
import GovernancegroupView from "./aigovernance/governancegroup/GovernancegroupView";
import AddEditGovernancegroup from "./aigovernance/governancegroup/AddEditGovernancegroup";
/****************************Company************************************ */
import Company from "./aigovernance/company/Company";
import CompanyView from "./aigovernance/company/CompanyView";
import AddEditCompany from "./aigovernance/company/AddEditCompany";
/****************Projects***************** */
import Projecthome from "./aigovernance/project/Projecthome";
import ProjectsView from "./aigovernance/project/ProjectView";
import AddEditproject from "./aigovernance/project/AddEditproject";
/****************Governance control**************** */
import Governancecontrol from "./aigovernance/governancecontrol/Governancecontrol";
import AddEditGovernancecontrol from "./aigovernance/governancecontrol/AddEditGovernancecontrol";
import GovernancecontrolView from "./aigovernance/governancecontrol/GovernancecontrolView";
/****************Governance Test result**************** */
import Governancetestresult from "./aigovernance/governancetestresult/Governancetestresult";
import AddEditGovernancetestresult from "./aigovernance/governancetestresult/AddEditGovernancetestresult";
import Governancetestresultview from "./aigovernance/governancetestresult/Governancetestresultview";

/************Project Audit********************/
import ProjectAudit from "./aigovernance/projectaudit/ProjectAudit";
import ProjectAuditView from "./aigovernance/projectaudit/projectAuditView";
import AddEditProjectAudit from "./aigovernance/projectaudit/addEditProjectAudit";
import Thrustarea from "./aigovernance/thrustarea/Thrustarea";
import Addeditthrust from "./aigovernance/thrustarea/Addeditthrust";
import Evidence from "./aigovernance/evidence/Evidence";
import Assesment from "./aigovernance/assesment/Assesment";
import ListEvidence from "./aigovernance/evidence/ListEvidence";
import AssesmentList from "./aigovernance/assesment/AssesmentList";
import GovEvidenceList from "./aigovernance/evidence/GovEvidenceList";
import GovEvidence from "./aigovernance/evidence/GovEvidence";
/*------------------------Algorithm Inventory----------------------------*/
import AlgorithmInventoryTable from "./aigovernance/AlgorithmInventory/AlgorithmInventoryTable";
import AlgorithmInventoryAddEdit from "./aigovernance/AlgorithmInventory/AlgorithmInventoryAddEdit";
import AlgorithmInventoryView from "./aigovernance/AlgorithmInventory/AlgorithmInventoryView";
import GovernanceReport from "./aigovernance/AlgorithmInventory/GovernanceReport";
import Projects from "./aigovernance/project/Projects";
import Algorithminventorygraph from "./aigovernance/AlgorithmInventory/Algorithminventorygraph";
/***************DATA Lineage*********************** */
import EvidenceAddEdit from "./aigovernance/datalineage/EvidenceAddEdit";
import EvidenceTable from "./aigovernance/datalineage/EvidenceTable";
/*************Activity Group*************************************/
import ActivityGroupTable from "./aigovernance/ActivityGroup/ActivityGroupTable";
import ActivityGroupAddEdit from "./aigovernance/ActivityGroup/ActivityGroupAddEdit";
import ActivityGroupView from "./aigovernance/ActivityGroup/ActivityGroupView";

/*------------------------Theme Activity----------------------------*/
import ThemeActivityAddEdit from "./aigovernance/ThemeActivity/ThemeActivityAddEdit";
import ThemeActivityTable from "./aigovernance/ThemeActivity/ThemeActivityTable";
import ThemeActivityView from "./aigovernance/ThemeActivity/ThemeActivityView";

/*------------------------Vendor Master----------------------------*/
import VendorMasterTable from "./aigovernance/VendorMaster/VendorMasterTable";
import VendorMasterAddEdit from "./aigovernance/VendorMaster/VendorMasterAddEdit";
import VendorMasterView from "./aigovernance/VendorMaster/VendorMasterView";

/*------------------------Vendor Master----------------------------*/
import TechnologyTable from "./aigovernance/TechnologyMaster/TechnologyTable";
import TechnologyAddEdit from "./aigovernance/TechnologyMaster/TechnologyAddEdit";
import TechnologyView from "./aigovernance/TechnologyMaster/TechnologyView";

/*------------------------Vulnerability----------------------------**/
import VulnerabilityTable from "./aigovernance/Vulnerability/VulnerabilityTable";
import VulnerabilityAddEdit from "./aigovernance/Vulnerability/VulnerabilityAddEdit";
import VulnerabilityView from "./aigovernance/Vulnerability/VulnerabilityView";

/*------------------------Resource----------------------------*/
import ResourceTable from "./aigovernance/Resource/ResourceTable";
import ResourceAddEdit from "./aigovernance/Resource/ResourceAddEdit";
import ResourceView from "./aigovernance/Resource/ResourceView";
import DatasetAddEdit from "./aigovernance/dataset/DatasetAddEdit";
/********************THEME Master*********************** */
import ThemeAddEdit from "./aigovernance/ThemeMaster/ThemeAddEdit";
import ThemeTable from "./aigovernance/ThemeMaster/ThemeTable";
import ThemeView from "./aigovernance/ThemeMaster/ThemeView";
import Dataset from "./aigovernance/dataset/Dataset";
/**********CHECKLIST****** */
import Checklist from "./aigovernance/checklist/Checklist";
import ChecklistTable from "./aigovernance/checklist/ChecklistTable";

/*------------------------Framework----------------------------*/
import Framework from "./aigovernance/Framework/Framework";
import ThrustArea from "./aigovernance/Framework/ThrustArea";
import ControlName from "./aigovernance/Framework/ControlName";
import SubControlName from "./aigovernance/Framework/SubControlName";
import AssessmentStatus from "./aigovernance/Framework/AssessmentStatus";
import AuditStatus from "./aigovernance/Framework/AuditStatus";

/*------------------------Score Card----------------------------*/
import ScoreCardTable from "./aigovernance/ScoreCard/ScoreCardTable";
import ScorecardBarGraph from "./aigovernance/ScoreCard/ScorecardBarGraph";
import ScoreCardSubControl from "./aigovernance/ScoreCard/ScoreCardSubControl";
import FilteredData from "./aigovernance/FilteredData";
import AllocatedResource from "./aigovernance/Resource/AllocatedResource";
/*********************ISsue************************ */
import Issue from "./aigovernance/IssueManagement/Issue";
import FishBone from "./aigovernance/IssueManagement/FishBone";
import IssueTable from "./aigovernance/IssueManagement/IssueTable";
import IssueChecklist from "./aigovernance/IssueManagement/IssueChecklist";
import KanbanBoard from "./aigovernance/AlgorithmInventory/KanbanBoard";
import Gantt from "./aigovernance/gantt-chart/Gantt";
import Chatbot from "./aigovernance/ChatBOT/Chatbot";
import QuantileClientComponent from "./aigovernance/Bot/Quantile";
import Bot from "./aigovernance/Bot/Bot";
import AnthropogenicAPIComponent from "./aigovernance/Bot/AnthropogenicAPIComponent ";
import QuantileAPIImageGeneretion from "./aigovernance/Bot/QuantileAPIComponent";
import UploadComponent from "./aigovernance/ExcelUpload/UploadComponent";
import PDFBot from "./aigovernance/Bot/PDFBot";
import RagChatComponent from "./aigovernance/Bot/PDFBot";
import AIChecklist from "./aigovernance/AlgorithmInventory/AIChecklist";
import Login from "./Login/Login";
import Signup from "./Login/Signup";
import DataTable from "./aigovernance/test";
function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer position="top-centre" />
        <Routes>
          {/**********Term And TermSet Routes********************** */}
          <Route path="/" element={<Company />} />
          <Route path="/aigovernance" element={<Company />} />
          <Route path="/addTermSet" element={<AddEdit />} />
          <Route path="/update/:termsetid" element={<AddEdit />} />
          <Route path="/view/:termsetid" element={<View />} />
          <Route path="/addTerm/:termsetid" element={<AddEditTerms />} />
          <Route
            exact
            path="/update/term/:termid/:termsetid"
            element={<AddEditTerms />}
          />
          {/*****************Project Phase routes ******************/}
          <Route path="/projectPhase" element={<Project />} />
          <Route
            exact
            path="/addProjectPhase"
            element={<AddEditProjectPhase />}
          />
          <Route
            exact
            path="/edit/projectphase/:phaseid"
            element={<AddEditProjectPhase />}
          />
          <Route
            exact
            path="/projectphase/view/:phaseid"
            element={<ProjectView />}
          />
          {/**********************Governance Sub-Control routes******************************* */}
          <Route
            exact
            path="/governancesubcontrol"
            element={<Governancesubcontrol />}
          />
          <Route path="/addGovernancesubcontrol" element={<AddEditGS />} />
          <Route
            exact
            path="/governanceEdit/:subcontrolid"
            element={<AddEditGS />}
          />
          <Route
            exact
            path="/governancesubcontrolView/:subcontrolid"
            element={<GovernancesubcontrolView />}
          />
          {/**********************Governance Group routes******************************* */}
          <Route path="/governanceGroup" element={<Governancegroup />} />
          <Route
            exact
            path="/addGovernanceGroup"
            element={<AddEditGovernancegroup />}
          />
          <Route
            exact
            path="/governanceGroupEdit/:groupid"
            element={<AddEditGovernancegroup />}
          />
          <Route
            exact
            path="/governanceGroupView/:groupid"
            element={<GovernancegroupView />}
          />
          {/**********************Company Details routes******************************* */}
          <Route path="/aigovernance" element={<Company />} />
          <Route path="/companyView/:companyid" element={<CompanyView />} />
          <Route path="/addcompany" element={<AddEditCompany />} />
          <Route
            exact
            path="/editcompany/:companyid"
            element={<AddEditCompany />}
          />
          {/**********************Project routes******************************* */}
          <Route path="/project/:companyid" element={<Projecthome />} />
          <Route
            exact
            path="/Viewproject/:companyid/:projectid"
            element={<ProjectsView />}
          />
          <Route
            exact
            path="/addproject/:companyid"
            element={<AddEditproject />}
          />
          <Route
            exact
            path="/projectedit/:companyid/:projectid"
            element={<AddEditproject />}
          />
          <Route path="/projects" element={<Projects />} />
          {/**********************Governance Control******************************* */}
          <Route
            exact
            path="/governancecontrol"
            element={<Governancecontrol />}
          />
          <Route
            exact
            path="/controlGovernanceView/:controlid"
            element={<GovernancecontrolView />}
          />
          <Route
            exact
            path="/addGovernancecontrol/"
            element={<AddEditGovernancecontrol />}
          />
          <Route
            exact
            path="/controlGovernanceedit/:controlid"
            element={<AddEditGovernancecontrol />}
          />
          {/**********************Project Governance Audit******************************* */}
          <Route
            exact
            path="/governancetestresult/:resultid/:projectid/:companyid/:auditid"
            element={<Governancetestresult />}
          />
          {/***************************************** */}
          <Route
            exact
            path="/AddGovernancetestresult/:auditid/:projectid/:companyid/:resultid"
            element={<AddEditGovernancetestresult />}
          />
          {/******************Direct From Evidence*********************** */}
          <Route
            exact
            path="/AddGovernancetestresult/:projectid/:companyid/:resultid"
            element={<AddEditGovernancetestresult />}
          />
          {/******************************************** */}
          <Route
            exact
            path="/resultTestGovernanceView/:auditid/:projectid/:companyid"
            element={<Governancetestresultview />}
          />
          <Route
            exact
            path="/EditGovernancetestresult/:resultid/:auditid"
            element={<AddEditGovernancetestresult />}
          />
          {/* *********************Governance Project Audit Details*******************************
          <Route
            exact
            path="/governanceprojectdetails"
            element={<Projectdetails/>}
          />
          <Route
            exact
            path="/addprojectdetails"
            element={<AddEditprojectdetails/>}
          />
          <Route
            exact
            path="/detailsprojectview/:srno"
            element={<Projectdetailsview/>}
          />
          <Route
            exact
            path="/detailseditproject/:srno"
            element={<AddEditprojectdetails/>}
          /> */}
          {/***********************Project Audit Routes***************************** */}
          <Route path="/directprojectaudit" element={<ProjectAudit />} />
          <Route
            exact
            path="/directprojectauditAdd"
            element={<AddEditProjectAudit />}
          />
          {/***********************Direct Routef Audits************************* */}
          <Route
            exact
            path="/projectaudit/:projectid/:companyid/:resultid"
            element={<ProjectAudit />}
          />
          <Route
            exact
            path="/projectauditAdd/:projectid/:companyid/:resultid"
            element={<AddEditProjectAudit />}
          />
          <Route
            exact
            path="/projectauditEdit/:auditid/:projectid/:companyid"
            element={<AddEditProjectAudit />}
          />
          <Route
            exact
            path="/projectauditViews/:auditid"
            element={<ProjectAuditView />}
          />
          {/***********************Thrust Area***************************** */}
          <Route path="/thrustarea" element={<Thrustarea />} />
          <Route path="/thrustareaAdd" element={<Addeditthrust />} />
          <Route
            exact
            path="/thrustareaEdit/:thrustid"
            element={<Addeditthrust />}
          />
          {/**************ROUTE FOR EVIDENCE********** */}
          <Route
            exact
            path="/evidence/:projectid/:companyid"
            element={<Evidence />}
          />
          <Route
            exact
            path="/evidenceList/:projectid/:companyid"
            element={<ListEvidence />}
          ></Route>
          <Route
            exact
            path="/evidenceEdit/:projectid/:companyid/:resultid"
            element={<Evidence />}
          ></Route>
          <Route
            exact
            path="/GovEvidence/:projectid/:companyid"
            element={<GovEvidence />}
          ></Route>
          <Route
            exact
            path="/GovEvidenceedit/:projectid/:companyid/:resultid"
            element={<GovEvidence />}
          ></Route>
          <Route
            exact
            path="/GovEvidenceList/:projectid/:companyid"
            element={<GovEvidenceList />}
          ></Route>
          {/**************ROUTE FOR assessment********** */}
          <Route
            exact
            path="/assessment/:projectid/:companyid/:resultid"
            element={<Assesment />}
          />
          <Route
            exact
            path="/assessmentList/:projectid/:companyid/:resultid"
            element={<AssesmentList />}
          />
          <Route
            exact
            path="/assessmentEdit/:projectid/:companyid/:resultid"
            element={<Assesment />}
          />
          {/*------------------------Algorithm Inventory----------------------------*/}
          <Route
            exact
            path="/algorithminventory"
            element={<AlgorithmInventoryTable />}
          />
          <Route
            exact
            path="/addalgorithminventory"
            element={<AlgorithmInventoryAddEdit />}
          />
          <Route
            exact
            path="/algorithminventoryupdate/:algorithminventoryid"
            element={<AlgorithmInventoryAddEdit />}
          />
          <Route
            exact
            path="/algorithminventoryview/:projectcode"
            element={<AlgorithmInventoryView />}
          />
          <Route path="/governancereport" element={<GovernanceReport />} />
          <Route
            path="/algorithminventorygraph/:projectcode"
            element={<Algorithminventorygraph />}
          />
          {/**********************Dashboard************************** */}
          {/* <Route path="/dashboard" element={<DashBoardTable />} /> */}
          {/*******************DATA Lineage*********************** */}
          <Route path="/datalineage" element={<EvidenceTable />} />
          <Route path="/adddatalineage" element={<EvidenceAddEdit />} />
          <Route
            path="/datalineageupdate/:datalineageid"
            element={<EvidenceAddEdit />}
          />
          {/*------------------------Theme Master----------------------------*/}
          <Route path="/thememaster" element={<ThemeTable />} />
          <Route path="/addthememaster" element={<ThemeAddEdit />} />
          <Route
            path="/thememasterupdate/:thememasterid"
            element={<ThemeAddEdit />}
          />
          <Route
            path="/thememasterview/:thememasterid"
            element={<ThemeView />}
          />
          {/*------------------------Activity Group----------------------------*/}
          <Route path="/activitygroup" element={<ActivityGroupTable />} />
          <Route path="/addactivitygroup" element={<ActivityGroupAddEdit />} />
          <Route
            path="/activitygroupupdate/:activitygroupid"
            element={<ActivityGroupAddEdit />}
          />
          <Route
            path="/activitygroupview/:activitygroupid"
            element={<ActivityGroupView />}
          />
          {/*------------------------Theme Activity----------------------------*/}
          <Route path="/themeactivity" element={<ThemeActivityTable />} />
          <Route path="/addthemeactivity" element={<ThemeActivityAddEdit />} />
          <Route
            path="/themeactivityupdate/:themeactivityid"
            element={<ThemeActivityAddEdit />}
          />
          <Route
            path="/themeactivityview/:themeactivityid"
            element={<ThemeActivityView />}
          />
          {/*------------------------Vendor Master----------------------------*/}
          <Route path="/vendormaster" element={<VendorMasterTable />} />
          <Route path="/addvendormaster" element={<VendorMasterAddEdit />} />
          <Route
            path="/vendormasterupdate/:vendorid"
            element={<VendorMasterAddEdit />}
          />
          <Route
            path="/vendormasterview/:vendorid"
            element={<VendorMasterView />}
          />
          {/*------------------------Technology----------------------------*/}
          <Route path="/technology" element={<TechnologyTable />} />
          <Route path="/addtechnology" element={<TechnologyAddEdit />} />
          <Route
            path="/addtechnologyupdate/:technologymasterid"
            element={<TechnologyAddEdit />}
          />
          <Route
            path="/technologyview/:technologymasterid"
            element={<TechnologyView />}
          />
          {/*------------------------Vulnerability----------------------------*/}
          <Route path="/vulnerability" element={<VulnerabilityTable />} />
          <Route path="/addvulnerability" element={<VulnerabilityAddEdit />} />
          <Route
            path="/vulnerabilityupdate/:vulnerabilityid"
            element={<VulnerabilityAddEdit />}
          />
          <Route
            path="/vulnerabilityView/:vulnerabilityid"
            element={<VulnerabilityView />}
          />
          {/*------------------------Resource----------------------------*/}
          <Route path="/resource" element={<ResourceTable />} />
          <Route path="/addresource" element={<ResourceAddEdit />} />
          <Route
            path="/resourceupdate/:resourceid"
            element={<ResourceAddEdit />}
          />
          <Route path="/resourceview/:resourceid" element={<ResourceView />} />
          <Route
            path="/resourcelist/:companyid/:projectid"
            element={<AllocatedResource />}
          />
          {/***************************DATA SET************************* */}
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/adddataset" element={<DatasetAddEdit />} />
          <Route
            path="/datasetupdate/:datasetid"
            element={<DatasetAddEdit />}
          />
          {/********************CHECKLIST******************************** */}
          <Route
            path="/checklist/:algorithminventoryid"
            element={<Checklist />}
          />
          <Route
            path="/checklistTable/:algorithminventoryid"
            element={<ChecklistTable />}
          />
          {/*------------------------Framework----------------------------*/}
          <Route path="/framework" element={<Framework />} />
          <Route path="/thrustareagraph/:groupname" element={<ThrustArea />} />
          <Route
            path="/controlnamegraph/:thrustarea"
            element={<ControlName />}
          />
          <Route
            path="/subcontrolnamegraph/:subcontrolname"
            element={<SubControlName />}
          />
          <Route
            path="/assessmentstatusgraph/:controlname"
            element={<AssessmentStatus />}
          />
          <Route
            path="/auditstatusgraph/:assessmentstatus"
            element={<AuditStatus />}
          />
          {/*------------------------Score Card----------------------------*/}
          <Route path="/scorecard" element={<ScoreCardTable />} />
          <Route path="/scorecardbargraph" element={<ScorecardBarGraph />} />
          <Route
            path="/scorecardsubcontrol"
            element={<ScoreCardSubControl />}
          />
          <Route path="/nazi" element={<FilteredData />} />
          {/**************Issue Management********************** */}
          <Route
            path="/issue/:issueid/:algorithminventoryid"
            element={<Issue />}
          />
          <Route path="fishbone/:algorithminventoryid" element={<FishBone />} />
          <Route
            path="issueTable/:algorithminventoryid"
            element={<IssueTable />}
          />
          <Route
            path="/issueChecklist/:algorithminventoryid"
            element={<IssueChecklist />}
          />
          {/******************************************************************** */}
          <Route path="/kanbanai" element={<KanbanBoard />} />
          <Route path="/ganttchart" element={<Gantt />} />

          {/***************CHAT BOTS**************************** */}
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/quantile" element={<QuantileClientComponent />} />
          <Route path="/bot" element={<Bot />} />
          <Route path="/anthropic" element={<AnthropogenicAPIComponent />} />
          <Route path="/ImageGen" element={<QuantileAPIImageGeneretion />} />
          <Route path="/pdfBot" element={<PDFBot />} />
          {/***************FILE UPLOAD******************************* */}
          <Route path="/excelupload" element={<RagChatComponent />} />
          <Route path="/themeupload" element={<UploadComponent />} />
          <Route path="/aichecklist" element={<AIChecklist />} />

          {/*************LOGIN******************************* */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test" element={<DataTable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
