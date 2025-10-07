"use client";

import { Form, Button, Row, Col } from "react-bootstrap";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

export default function AssignmentEditor() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["everyone"]);
  
  const options: Option[] = [
    { value: "everyone", label: "Everyone" },
    { value: "section101", label: "Section 101" },
    { value: "section102", label: "Section 102" },
    { value: "groupA", label: "Group A" },
    { value: "groupB", label: "Group B" },
    { value: "individual", label: "Individual Students" }
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setSelectedOptions(selectedValues);
  };

  const removeOption = (valueToRemove: string) => {
    setSelectedOptions(selectedOptions.filter(value => value !== valueToRemove));
  };

  const getOptionLabel = (value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <div className="mb-3">
          <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
          <Form.Control id="wd-name" type="text" defaultValue="A1 - ENV + HTML" />
        </div>

        <div className="mb-3">
          <Form.Control 
            as="textarea" 
            id="wd-description" 
            rows={9}
            defaultValue={`The assignment is available online

Submit a link to the landing page of your Web application running on Netflix.

The landing page should include the following:

- Your full name and section
- Links to each of the lab assignments
- Link to the Kanbas application
- Links to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`}
          />
        </div>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-points" className="text-end">
            Points
          </Form.Label>
          <Col sm={9}>
            <Form.Control id="wd-points" type="number" defaultValue={100} />
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-group" className="text-end">
            Assignment Group
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-group">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-display-grade-as" className="text-end">
            Display Grade as
          </Form.Label>
          <Col sm={9}>
            <Form.Select id="wd-display-grade-as">
              <option value="Percentage">Percentage</option>
              <option value="Points">Points</option>
              <option value="Letter">Letter Grade</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-submission-type" className="text-end">
            Submission Type
          </Form.Label>
          <Col sm={9}>
            <div className="border rounded p-3">
              <Form.Select id="wd-submission-type" className="mb-3">
                <option value="Online">Online</option>
                <option value="Paper">Paper</option>
                <option value="External Tool">External Tool</option>
              </Form.Select>

              <Form.Label className="fw-bold">Online Entry Options</Form.Label>
              
              <Form.Check 
                type="checkbox" 
                id="wd-text-entry" 
                label="Text Entry" 
              />
              
              <Form.Check 
                type="checkbox" 
                id="wd-website-url" 
                label="Website URL" 
              />
              
              <Form.Check 
                type="checkbox" 
                id="wd-media-recordings" 
                label="Media Recordings" 
              />
              
              <Form.Check 
                type="checkbox" 
                id="wd-student-annotation" 
                label="Student Annotation" 
              />
              
              <Form.Check 
                type="checkbox" 
                id="wd-file-upload" 
                label="File Uploads" 
              />
            </div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Label column sm={3} htmlFor="wd-assign-to" className="text-end">
            Assign
          </Form.Label>
          <Col sm={9}>
            <div className="border rounded p-3">
              <Form.Label className="fw-bold">
                Assign to
              </Form.Label>
              
              {/* Custom Multi-select Component */}
              <div className="mb-3">
                {/* Selected Tags Display */}
                <div className="border rounded p-2 mb-2 bg-light min-h-38">
                  {selectedOptions.map(value => (
                    <span 
                      key={value} 
                      className="badge bg-secondary me-1 mb-1 d-inline-flex align-items-center"
                    >
                      {getOptionLabel(value)}
                      <button 
                        type="button" 
                        className="btn-close btn-close-white ms-1" 
                        style={{fontSize: '0.6rem'}} 
                        aria-label={`Remove ${getOptionLabel(value)}`}
                        onClick={() => removeOption(value)}
                      ></button>
                    </span>
                  ))}
                  {selectedOptions.length === 0 && (
                    <span className="text-muted">No options selected</span>
                  )}
                </div>
                
                {/* Multi-select dropdown */}
                <Form.Select 
                  multiple 
                  value={selectedOptions}
                  onChange={handleSelectChange}
                  size="lg"
                  className="form-control"
                >
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <Form.Label htmlFor="wd-due-date" className="fw-bold">
                Due
              </Form.Label>
              <Form.Control id="wd-due-date" type="datetime-local" defaultValue="2024-05-13T23:59" className="mb-3" />

              <Row>
                <Col>
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">
                    Available from
                  </Form.Label>
                  <Form.Control id="wd-available-from" type="datetime-local" defaultValue="2024-05-06T00:00" />
                </Col>
                <Col>
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">
                    Until
                  </Form.Label>
                  <Form.Control id="wd-available-until" type="datetime-local" defaultValue="2024-05-20T23:59" />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <hr />
        
        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2">Cancel</Button>
          <Button variant="danger">Save</Button>
        </div>
      </Form>
    </div>
  );
}