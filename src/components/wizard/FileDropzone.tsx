import { useDropzone } from "react-dropzone";
import { UploadCloud, X, FileText, ImageIcon } from "lucide-react";

export type PendingFile = { id: string; file: File };

export function FileDropzone({
  files,
  onChange,
}: {
  files: PendingFile[];
  onChange: (files: PendingFile[]) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (accepted) => {
      const next = accepted
        .filter((f) => f.size <= 20 * 1024 * 1024)
        .map((file) => ({ id: crypto.randomUUID(), file }));
      onChange([...files, ...next]);
    },
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
      "application/zip": [],
      "application/postscript": [],
      "application/illustrator": [],
    },
  });

  const remove = (id: string) => onChange(files.filter((f) => f.id !== id));

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer ${
          isDragActive
            ? "border-brand-primary bg-brand-primary/5"
            : "border-brand-border hover:border-brand-primary/50 bg-brand-card/30"
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="size-6 mx-auto text-brand-text-muted mb-2" />
        <p className="text-sm text-white">Arraste arquivos ou clique para buscar</p>
        <p className="text-[10px] uppercase tracking-widest text-brand-text-muted/60 mt-2">
          Imagens · PDF · DOC · ZIP — Máximo 20MB por arquivo
        </p>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-card border border-brand-border text-sm"
            >
              {f.file.type.startsWith("image/") ? (
                <ImageIcon className="size-4 text-brand-text-muted shrink-0" />
              ) : (
                <FileText className="size-4 text-brand-text-muted shrink-0" />
              )}
              <span className="truncate flex-1">{f.file.name}</span>
              <span className="text-xs text-brand-text-muted shrink-0">
                {(f.file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => remove(f.id)}
                className="text-brand-text-muted hover:text-white"
                aria-label="Remover arquivo"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
