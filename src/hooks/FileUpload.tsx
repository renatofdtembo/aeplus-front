import React, { useCallback, useId, useRef } from 'react';
import {
  FileText,
  FileImage,
  FileCode,
  FileArchive,
  FileVideo,
  FileAudio,
  File,
  CloudUpload,
  Trash2,
  Plus
} from 'lucide-react';

interface FileUploadProps {
  label: string;
  value?: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  maxSizeMB?: number;
  id?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  value = [],
  onChange,
  multiple = false,
  accept = '*/*',
  disabled = false,
  maxSizeMB = 10,
  id
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const defaultId = useId();
  const fileInputId = id || `file-input-${defaultId}`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const type = file.type.split('/')[0];

    switch (type) {
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-6 w-6 text-red-500" />;
      case 'audio':
        return <FileAudio className="h-6 w-6 text-purple-500" />;
      default:
        switch (extension) {
          case 'pdf':
            return <FileText className="h-6 w-6 text-red-500" />;
          case 'doc':
          case 'docx':
            return <FileText className="h-6 w-6 text-blue-600" />;
          case 'xls':
          case 'xlsx':
            return <FileText className="h-6 w-6 text-green-600" />;
          case 'zip':
          case 'rar':
          case '7z':
            return <FileArchive className="h-6 w-6 text-yellow-600" />;
          case 'js':
          case 'ts':
          case 'html':
          case 'css':
            return <FileCode className="h-6 w-6 text-orange-500" />;
          default:
            return <File className="h-6 w-6 text-gray-500" />;
        }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.size <= maxSizeMB * 1024 * 1024);
    
    // Concatenar com os arquivos existentes se for múltiplo
    const newFiles = multiple ? [...value, ...validFiles] : validFiles;
    onChange(newFiles);
  }, [disabled, maxSizeMB, multiple, value, onChange]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= maxSizeMB * 1024 * 1024);
    
    // Concatenar com os arquivos existentes se for múltiplo
    const newFiles = multiple ? [...value, ...validFiles] : validFiles;
    onChange(newFiles);

    // reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [disabled, maxSizeMB, multiple, value, onChange]);

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const handleAddMoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  }, []);

  return (
    <div className="w-full">
      <label htmlFor={fileInputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>

      {/* Área de Upload - Agora sempre presente no DOM, mas oculta quando há arquivos */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 mb-4
          ${isDragging
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${value.length > 0 ? 'hidden' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={fileInputId}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <div className="text-center">
          <CloudUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">
              Clique para enviar
            </span>
            <p className="mt-1">ou arraste e solte os arquivos aqui</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Formatos: {accept === '*/*' ? 'Todos' : accept} • Máx: {maxSizeMB}MB
          </p>
        </div>
      </div>

      {/* Grid de Arquivos Compactos */}
      {value.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
            {value.map((file, index) => (
              <div
                key={`${fileInputId}-${index}`}
                className="relative group bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 p-2 hover:shadow-md transition-all duration-150"
                title={file.name}
              >
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                )}

                <div className="flex justify-center mb-1">
                  {getFileIcon(file)}
                </div>

                <div className="text-center">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                <div className="absolute top-1 left-1">
                  <span className="text-[8px] uppercase font-bold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                    {file.type.split('/')[1]?.substring(0, 3) || file.name.split('.').pop()?.substring(0, 3)}
                  </span>
                </div>
              </div>
            ))}

            {/* Card de adicionar mais (só aparece se for múltiplo) */}
            {multiple && !disabled && (
              <div
                className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md border border-dashed border-gray-300 dark:border-gray-600 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                onClick={handleAddMoreClick}
                title="Adicionar mais arquivos"
              >
                <Plus className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>

          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {value.length} arquivo{value.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};