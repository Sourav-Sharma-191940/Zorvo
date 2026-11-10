"use client";

import { useRef, useState, type DragEvent } from "react";
import { CheckCircle2, CircleAlert, FileUp, Upload } from "lucide-react";
import { Button, IconTile } from "@/shared/ui/primitives";
import { FormModal } from "@/shared/ui/FormModal";
import { DialogFooter } from "@/shared/ui/dialog";
import { CheckTile, Field, FormGrid, FormRow, FormSelect, Input, Textarea } from "@/shared/ui/form";
import { Progress } from "@/shared/ui/Progress";
import { cn } from "@/shared/lib/utils";
import { documentCategories } from "../data";

type UploadPhase = "form" | "uploading" | "success" | "error";

export function UploadModal({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [phase, setPhase] = useState<UploadPhase>("form");
  const [dragging, setDragging] = useState(false);
  const [reminder, setReminder] = useState(true);

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
        <div className="flex min-h-82.5 flex-col items-center justify-center text-center">
          <IconTile tone="emerald" className="size-13.5 rounded-full">
            <CheckCircle2 size="1.75rem" />
          </IconTile>
          <strong className="mt-3.5 text-lg">Document uploaded</strong>
          <p className="mt-1.5 mb-4.5 max-w-82.5 text-xs leading-4 text-muted-foreground">
            {fileName} is now safely stored in your document vault.
          </p>
          <Button onClick={onClose}>Done</Button>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "flex min-h-32.5 flex-col items-center justify-center rounded-lg border border-dashed border-border-strong bg-muted p-4 text-center transition sm:min-h-35.5",
              dragging && "border-primary-accent bg-primary-soft",
              phase === "error" && "border-destructive bg-destructive-soft",
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={dropFile}
          >
            <IconTile className="mb-2">
              <FileUp size="1.5rem" />
            </IconTile>
            <strong className="text-xs">{fileName || "Drag and drop your document here"}</strong>
            <small className="mt-0.75 mb-2.5 text-2xs text-subtle-foreground">
              {fileName ? "Ready to upload" : "PDF, JPG or PNG · Maximum 20 MB"}
            </small>
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
            <div role="alert" className="mt-1.75 flex items-center gap-1.5 text-2xs text-destructive">
              <CircleAlert size="0.9375rem" />
              Select a supported file before uploading.
            </div>
          )}
          {phase === "uploading" && (
            <div className="mt-2.5 grid gap-1.5">
              <div className="flex justify-between text-2xs text-muted-foreground">
                <span>Uploading {fileName}</span>
                <strong>72%</strong>
              </div>
              <Progress value={72} label="Upload progress" className="animate-pulse" />
            </div>
          )}

          <FormGrid className="mt-4">
            <Field label="Document name">
              <Input
                defaultValue={fileName.replace(/\.[^/.]+$/, "")}
                placeholder="e.g. Car insurance policy"
              />
            </Field>
            <FormRow>
              <Field label="Category">
                <FormSelect defaultValue="">
                  <option value="" disabled>
                    Select category
                  </option>
                  {documentCategories.slice(1).map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </FormSelect>
              </Field>
              <Field label="Issue date">
                <Input type="date" />
              </Field>
            </FormRow>
            <FormRow>
              <Field label="Expiry date" optional>
                <Input type="date" />
              </Field>
              <CheckTile
                title="Expiry reminder"
                description="Notify me 30 days before"
                checked={reminder}
                onChange={setReminder}
              />
            </FormRow>
            <Field label="Notes" optional>
              <Textarea placeholder="Add any helpful context..." />
            </Field>
          </FormGrid>

          <DialogFooter>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={upload} disabled={phase === "uploading"}>
              <Upload size="1rem" />
              {phase === "uploading" ? "Uploading..." : "Upload document"}
            </Button>
          </DialogFooter>
        </>
      )}
    </FormModal>
  );
}
