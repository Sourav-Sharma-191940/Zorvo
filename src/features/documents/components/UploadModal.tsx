"use client";

import { useRef, useState, type DragEvent } from "react";
import { CheckCircle2, CircleAlert, FileUp, Upload } from "lucide-react";
import { Button } from "@/shared/ui/primitives";
import { FormModal } from "@/shared/ui/FormModal";
import { documentCategories } from "../data";

type UploadPhase = "form" | "uploading" | "success" | "error";

export function UploadModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [phase, setPhase] = useState<UploadPhase>("form");
  const [dragging, setDragging] = useState(false);

  const chooseFile = (name: string) => {
    setFileName(name);
    setPhase("form");
  };

  const dropFile = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) chooseFile(file.name);
  };

  const upload = () => {
    if (!fileName) {
      setPhase("error");
      return;
    }
    setPhase("uploading");
    window.setTimeout(() => setPhase("success"), 1200);
  };

  return (
    <FormModal
      title="Upload document"
      subtitle="Add a file to your secure document vault."
      onClose={onClose}
    >
      {phase === "success" ? (
        <div className="upload-success">
          <span>
            <CheckCircle2 size="1.75rem" />
          </span>
          <strong>Document uploaded</strong>
          <p>{fileName} is now safely stored in your document vault.</p>
          <Button onClick={onClose}>Done</Button>
        </div>
      ) : (
        <>
          <div
            className={`drop-zone ${dragging ? "dragging" : ""} ${phase === "error" ? "drop-error" : ""}`.trim()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={dropFile}
          >
            <span className="drop-icon">
              <FileUp size="1.5rem" />
            </span>
            <strong>{fileName || "Drag and drop your document here"}</strong>
            <small>{fileName ? "Ready to upload" : "PDF, JPG or PNG · Maximum 20 MB"}</small>
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              {fileName ? "Choose another file" : "Browse files"}
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              hidden
              onChange={(event) =>
                event.target.files?.[0] && chooseFile(event.target.files[0].name)
              }
            />
          </div>

          {phase === "error" && (
            <div className="upload-error">
              <CircleAlert size="0.9375rem" />
              Select a supported file before uploading.
            </div>
          )}
          {phase === "uploading" && (
            <div className="upload-progress">
              <div>
                <span>Uploading {fileName}</span>
                <strong>72%</strong>
              </div>
              <div className="progress-track">
                <span />
              </div>
            </div>
          )}

          <div className="form-grid">
            <label>
              <span>Document name</span>
              <input
                defaultValue={fileName.replace(/\.[^/.]+$/, "")}
                placeholder="e.g. Car insurance policy"
              />
            </label>
            <div className="form-row">
              <label>
                <span>Category</span>
                <select defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>
                  {documentCategories.slice(1).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Issue date</span>
                <input type="date" />
              </label>
            </div>
            <div className="form-row">
              <label>
                <span>
                  Expiry date <em>Optional</em>
                </span>
                <input type="date" />
              </label>
              <label className="check-tile">
                <input type="checkbox" defaultChecked />
                <span>
                  <strong>Expiry reminder</strong>
                  <small>Notify me 30 days before</small>
                </span>
              </label>
            </div>
            <label>
              <span>
                Notes <em>Optional</em>
              </span>
              <textarea placeholder="Add any helpful context..." rows={3} />
            </label>
          </div>

          <div className="form-modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={upload} disabled={phase === "uploading"}>
              <Upload size="1rem" />
              {phase === "uploading" ? "Uploading..." : "Upload document"}
            </Button>
          </div>
        </>
      )}
    </FormModal>
  );
}
