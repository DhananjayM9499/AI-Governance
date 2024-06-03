import React from 'react'

const Modal = ({ closeModal,modalData }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        {/* <span className="close" onClick={closeModal}>&times;</span>
        <h2>Detailed Data</h2>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Governance</td>
              <td>{modalData.governanceCount}</td>
            </tr>
            <tr>
              <td>Risk</td>
              <td>{modalData.riskItems}</td>
            </tr>
            <tr>
              <td>Issue</td>
              <td>{modalData.issueCount}</td>
            </tr>
            <tr>
              <td>Checklist</td>
              <td>{modalData.checklistCount}</td>
            </tr>
            <tr>
              <td>Checklist</td>
              <td>{modalData.algorithminventoryCount}</td>
            </tr>
            <tr>
              <td>Checklist</td>
              <td>{modalData.evidenceCount}</td>
            </tr>
            <tr>
              <td>Checklist</td>
              <td>{modalData.assessmentreferencelinkCount}</td>
            </tr>
            <tr>
              <td>Checklist</td>
              <td>{modalData.auditreferencelinkCount}</td>
            </tr>

          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default Modal