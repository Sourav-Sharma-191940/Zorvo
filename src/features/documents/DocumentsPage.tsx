"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  ChevronDown,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Files,
  Grid2X2,
  HardDrive,
  List,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import "./documents.css";
import { Button } from "@/shared/ui/primitives";
import { PageHeader } from "@/shared/ui/PageHeader";
import { exportCsv } from "@/shared/lib/export-csv";
import { documentCategories, type DocumentRecord } from "./data";
import { useDeleteDocument, useDocuments } from "./hooks";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { StatCard } from "@/shared/ui/StatCard";
import { ActionMenu } from "@/shared/ui/ActionMenu";
import { DocumentDrawer } from "./components/DocumentDrawer";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { UploadModal } from "./components/UploadModal";

function SelectButton({ label }: { label: string }) {
  return (
    <button type="button" className="doc-select">
      {label}
      <ChevronDown size="0.875rem" />
    </button>
  );
}

export function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All Documents");
  const [view, setView] = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<DocumentRecord | null>(null);
  const [deleting, setDeleting] = useState<DocumentRecord | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const { data: documents = [], isLoading } = useDocuments();
  const deleteDocument = useDeleteDocument();

  const visible = useMemo(
    () =>
      documents.filter((doc) => {
        const matchesQuery = doc.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All Documents" || doc.category === category;
        return matchesQuery && matchesCategory;
      }),
    [category, documents, query],
  );

  const findById = (id: number) => documents.find((item) => item.id === id) ?? null;

  const openDelete = (record: DocumentRecord) => {
    setSelected(null);
    setDeleting(record);
  };

  const confirmDelete = () => {
    if (deleting) deleteDocument.mutate(deleting.id);
    setDeleting(null);
  };

  const exportDocuments = () =>
    exportCsv("personal-command-center-documents", [
      ["Document", "Category", "Type", "Added On", "Expiry Date", "Status"],
      ...visible.map((item) => [
        item.name,
        item.category,
        item.type,
        item.added,
        item.expiry,
        item.status,
      ]),
    ]);

  return (
    <div className="page-stack documents-page">
      <PageHeader
        title="Documents"
        subtitle="Securely manage your important personal documents in one place."
        actions={
          <>
            <Button variant="secondary" onClick={exportDocuments}>
              <Download size="1rem" />
              Export
            </Button>
            <Button onClick={() => setUploadOpen(true)}>
              <Upload size="1rem" />
              Upload document
            </Button>
          </>
        }
      />

      <section className="storage-card">
        <span className="storage-icon">
          <HardDrive size="1.125rem" />
        </span>
        <div className="storage-copy">
          <div>
            <strong>1.8 GB</strong> of 5 GB used
          </div>
          <div className="storage-track">
            <span />
          </div>
        </div>
        <span className="storage-percent">36% used</span>
      </section>

      <div className="stat-grid">
        <StatCard
          icon={Files}
          label="Total documents"
          value="48"
          detail="Across all categories"
          tone="indigo"
        />
        <StatCard
          icon={AlertTriangle}
          label="Expiring soon"
          value="3"
          detail="Expiring within 30 days"
          tone="amber"
        />
        <StatCard
          icon={FileCheck2}
          label="Recently added"
          value="6"
          detail="Added this month"
          tone="emerald"
        />
        <StatCard
          icon={Archive}
          label="Document categories"
          value="8"
          detail="Organized categories"
          tone="slate"
        />
      </div>

      <section className="card document-manager">
        <div className="document-toolbar">
          <label className="document-search">
            <Search size="1rem" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search documents..."
            />
          </label>
          <div className="toolbar-filters">
            <SelectButton label="All categories" />
            <SelectButton label="All types" />
            <SelectButton label="Recently updated" />
            <div className="view-toggle">
              <button
                type="button"
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <List size="1rem" />
              </button>
              <button
                type="button"
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Grid2X2 size="0.9375rem" />
              </button>
            </div>
          </div>
        </div>

        <div className="category-chips">
          {documentCategories.map((item) => (
            <button
              type="button"
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="document-empty">
            <span>
              <Search size="1.375rem" />
            </span>
            <strong>Loading documents...</strong>
            <p>Fetching your secure document vault.</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="document-empty">
            <span>
              <Search size="1.375rem" />
            </span>
            <strong>No documents found</strong>
            <p>Try a different search term or clear your selected category.</p>
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setCategory("All Documents");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : view === "list" ? (
          <div className="data-table-wrap">
            <table className="data-table interactive documents-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Category</th>
                  <th>Added on</th>
                  <th>Expiry date</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((record) => (
                  <tr key={record.id} onClick={() => setSelected(record)}>
                    <td>
                      <span className="cell-main">
                        <span className="cell-icon">
                          <FileText size="1.0625rem" />
                        </span>
                        <span className="cell-text">
                          <strong>{record.name}</strong>
                          <small>
                            {record.type} · {record.size}
                          </small>
                        </span>
                      </span>
                    </td>
                    <td data-label="Category">
                      <span className="badge badge-slate">{record.category}</span>
                    </td>
                    <td data-label="Added">{record.added}</td>
                    <td data-label="Expires" className="hide-mobile">
                      {record.expiry}
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="action-cell">
                      <ActionMenu
                        label={`Actions for ${record.name}`}
                        items={[
                          {
                            label: "View details",
                            icon: FileText,
                            onSelect: () => setSelected(record),
                          },
                          { label: "Preview", icon: Eye, onSelect: () => setSelected(record) },
                          { label: "Download", icon: Download, onSelect: () => {} },
                          {
                            label: "Edit metadata",
                            icon: Pencil,
                            onSelect: () => setSelected(record),
                          },
                          { label: "Replace file", icon: RefreshCw, onSelect: () => {} },
                          {
                            label: "Delete",
                            icon: Trash2,
                            onSelect: () => openDelete(record),
                            danger: true,
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="document-grid">
            {visible.map((record) => (
              <button
                type="button"
                className="document-grid-card"
                key={record.id}
                onClick={() => setSelected(record)}
              >
                <span className="document-file-icon">
                  <FileText size="1.25rem" />
                </span>
                <span className="grid-card-title">{record.name}</span>
                <span className="grid-card-meta">
                  {record.category} · {record.type}
                </span>
                <StatusBadge status={record.status} />
              </button>
            ))}
          </div>
        )}

        <div className="table-footer">
          <span>
            Showing {visible.length} of {documents.length} documents
          </span>
          <div>
            <button type="button" disabled>
              Previous
            </button>
            <span>1</span>
            <button type="button" disabled>
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="card expiring-documents">
        <div className="expiring-header">
          <div>
            <strong>Expiring documents</strong>
            <span>Documents that may need your attention</span>
          </div>
          <Button variant="ghost">View all</Button>
        </div>
        <div className="expiry-list">
          <button type="button" onClick={() => setSelected(findById(5))}>
            <span className="icon-tile icon-amber">
              <ShieldCheck size="1.125rem" />
            </span>
            <span>
              <strong>Car Insurance Policy</strong>
              <small>Insurance · Expires 28 Jul 2026</small>
            </span>
            <span className="badge badge-amber">Expiring soon</span>
            <ChevronDown size="1rem" />
          </button>
          <button type="button" onClick={() => setSelected(findById(8))}>
            <span className="icon-tile icon-indigo">
              <ShieldCheck size="1.125rem" />
            </span>
            <span>
              <strong>Health Insurance</strong>
              <small>Insurance · Expires 20 Aug 2027</small>
            </span>
            <span className="badge badge-indigo">Reminder set</span>
            <ChevronDown size="1rem" />
          </button>
        </div>
      </section>

      {selected && (
        <DocumentDrawer
          record={selected}
          onClose={() => setSelected(null)}
          onDelete={() => openDelete(selected)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={<>Delete &ldquo;{deleting.name}&rdquo;?</>}
          description="This document will be permanently removed from your secure storage. This action cannot be undone."
          confirmLabel="Delete document"
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </div>
  );
}
