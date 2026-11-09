"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Archive,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Files,
  Pencil,
  RefreshCw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge, Button, Card, IconTile } from "@/shared/ui/primitives";
import { CardHeader, PageHeader } from "@/shared/ui/PageHeader";
import { EmptyState, FilterChips, PageStack, SearchInput, TableFooter, ViewToggle, type ViewMode } from "@/shared/ui/layout";
import { Select } from "@/shared/ui/Select";
import { StatCard, StatGrid } from "@/shared/ui/StatCard";
import { exportCsv } from "@/shared/lib/export-csv";
import { documentCategories, type DocumentRecord } from "./data";
import { useDeleteDocument, useDocuments } from "./hooks";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ActionMenu } from "@/shared/ui/ActionMenu";
import { CellMain, DataTable, TBody, TD, TH, THead, TR } from "@/shared/ui/table";
import { DocumentDrawer } from "./components/DocumentDrawer";
import { DocumentCard } from "./components/DocumentCard";
import { ExpiryItem } from "./components/ExpiryItem";
import { StorageCard } from "./components/StorageCard";
import { ConfirmDialog } from "@/shared/ui/ConfirmDialog";
import { UploadModal } from "./components/UploadModal";

const noop = () => {};

export function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All Documents");
  const [view, setView] = useState<ViewMode>("list");
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
    <PageStack>
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

      <StorageCard usedLabel="1.8 GB" totalLabel="5 GB" percent={36} />

      <StatGrid>
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
      </StatGrid>

      <Card>
        <div className="flex flex-col gap-2.25 p-3 sm:gap-3 sm:px-4 sm:pt-3.75 sm:pb-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search documents..."
            className="lg:w-67.5"
          />
          <div className="flex flex-wrap items-center gap-1.75">
            <Select value="All categories" onChange={noop} label="Filter by category" className="max-sm:flex-1">
              <option>All categories</option>
            </Select>
            <Select value="All types" onChange={noop} label="Filter by type" className="max-sm:hidden">
              <option>All types</option>
            </Select>
            <Select value="Recently updated" onChange={noop} label="Sort documents" className="max-sm:hidden">
              <option>Recently updated</option>
            </Select>
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>

        <FilterChips
          label="Filter by document category"
          options={documentCategories}
          value={category}
          onChange={setCategory}
          className="gap-1.25 px-3 pb-2.5 sm:px-4 sm:pb-3.25"
        />

        {isLoading ? (
          <EmptyState
            icon={Search}
            title="Loading documents..."
            description="Fetching your secure document vault."
            className="min-h-77.5"
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No documents found"
            description="Try a different search term or clear your selected category."
            className="min-h-77.5"
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setCategory("All Documents");
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : view === "list" ? (
          <DataTable className="sm:min-w-212.5">
            <THead>
              <TH>Document</TH>
              <TH>Category</TH>
              <TH>Added on</TH>
              <TH>Expiry date</TH>
              <TH>Status</TH>
              <TH>
                <span className="sr-only">Actions</span>
              </TH>
            </THead>
            <TBody>
              {visible.map((record) => (
                <TR
                  key={record.id}
                  interactive
                  tabIndex={0}
                  onClick={() => setSelected(record)}
                  onKeyDown={(event) => {
                    if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      setSelected(record);
                    }
                  }}
                  className="focus-visible:bg-muted focus-visible:outline-none"
                >
                  <TD primary>
                    <CellMain
                      icon={
                        <IconTile size="sm" className="size-8">
                          <FileText size="1.0625rem" />
                        </IconTile>
                      }
                      title={record.name}
                      subtitle={`${record.type} · ${record.size}`}
                    />
                  </TD>
                  <TD label="Category">
                    <Badge tone="slate">{record.category}</Badge>
                  </TD>
                  <TD label="Added">{record.added}</TD>
                  <TD label="Expires" hideOnMobile>
                    {record.expiry}
                  </TD>
                  <TD label="Status" className="max-sm:self-end max-sm:text-right">
                    <StatusBadge status={record.status} />
                  </TD>
                  <TD actions>
                    <ActionMenu
                      label={`Actions for ${record.name}`}
                      items={[
                        {
                          label: "View details",
                          icon: FileText,
                          onSelect: () => setSelected(record),
                        },
                        { label: "Preview", icon: Eye, onSelect: () => setSelected(record) },
                        { label: "Download", icon: Download, onSelect: noop },
                        {
                          label: "Edit metadata",
                          icon: Pencil,
                          onSelect: () => setSelected(record),
                        },
                        { label: "Replace file", icon: RefreshCw, onSelect: noop },
                        {
                          label: "Delete",
                          icon: Trash2,
                          onSelect: () => openDelete(record),
                          danger: true,
                        },
                      ]}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </DataTable>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 border-t border-border p-2.5 max-sm:bg-background xs:grid-cols-2 sm:p-4 sm:pt-3.5 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {visible.map((record) => (
              <DocumentCard key={record.id} record={record} onOpen={() => setSelected(record)} />
            ))}
          </div>
        )}

        <TableFooter shown={visible.length} total={documents.length} noun="documents" />
      </Card>

      <Card>
        <CardHeader
          title="Expiring documents"
          subtitle="Documents that may need your attention"
          action={<Button variant="ghost">View all</Button>}
        />
        <div className="grid grid-cols-1 gap-2.5 px-3 pb-3 sm:px-4 sm:pb-4 md:grid-cols-2">
          <ExpiryItem
            tone="amber"
            title="Car Insurance Policy"
            meta="Insurance · Expires 28 Jul 2026"
            badge="Expiring soon"
            onOpen={() => setSelected(findById(5))}
          />
          <ExpiryItem
            tone="indigo"
            title="Health Insurance"
            meta="Insurance · Expires 20 Aug 2027"
            badge="Reminder set"
            onOpen={() => setSelected(findById(8))}
          />
        </div>
      </Card>

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
    </PageStack>
  );
}
