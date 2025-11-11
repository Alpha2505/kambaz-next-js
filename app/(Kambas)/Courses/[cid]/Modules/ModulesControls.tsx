import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import BlackBlockIcon from "./BlackBlockIcon";
import ModuleEditor from "./ModuleEditor";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export default function ModulesControls(
  { moduleName, setModuleName, addModule }:
{ moduleName: string; setModuleName: (title: string) => void; addModule: () => void; }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  // Check if current user is faculty
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";

  return (
    <div id="wd-modules-controls" className="text-nowrap">
      {/* Only show Add Module button for Faculty */}
      {isFaculty && (
        <>
          <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn" onClick={handleShow}>
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Module
          </Button>
          
          {/* Only show Publish All dropdown for Faculty */}
          <Dropdown className="float-end me-2">
            <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn">
              <GreenCheckmark /> Publish All
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem id="wd-publish-all-modules-and-items">
                <GreenCheckmark /> Publish all modules and items
              </DropdownItem>
              <DropdownItem id="wd-publish-modules-only">
                <GreenCheckmark /> Publish modules only
              </DropdownItem>
              <DropdownItem id="wd-unpublish-all-modules-and-items">
                <BlackBlockIcon /> Unpublish all modules and items
              </DropdownItem>
              <DropdownItem id="wd-unpublish-modules-only">
                <BlackBlockIcon /> Unpublish modules only
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
      
      <Button variant="secondary" size="lg" className="float-end me-2" id="wd-view-progress">
        View Progress
      </Button>
      <Button variant="secondary" size="lg" className="float-end me-2" id="wd-collapse-all">
        Collapse All
      </Button>
      
      {/* Module Editor Modal - only accessible for Faculty */}
      {isFaculty && (
        <ModuleEditor 
          show={show} 
          handleClose={handleClose} 
          dialogTitle="Add Module"
          moduleName={moduleName} 
          setModuleName={setModuleName} 
          addModule={addModule} 
        />
      )}
    </div>
  );
}