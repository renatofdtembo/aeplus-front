import { Camera } from 'lucide-react';
import React, { useState, ChangeEvent } from 'react';

interface AvatarUploadProps {
  initialImage?: string;
  backgroundImage?: string;
  label?: string;
  size?: number;
  onFileChange?: (file: File) => void;
  showLabel?: boolean;
}

export const containerStyle = (backgroundImage?: string): React.CSSProperties => {
  if (backgroundImage == '') return {};
  return {
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  initialImage = '',
  backgroundImage = '',
  label = 'Foto de perfil',
  size = 32,
  onFileChange,
  showLabel = false
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (onFileChange) {
        onFileChange(selectedFile);
      }
    }
  };


  return (
    <div
      className="flex flex-col items-center gap-2 p-4 rounded-lg"
      style={containerStyle(backgroundImage)}
    >
      <div className={`relative w-${size} h-${size}`}>
        <img
          src={file ? URL.createObjectURL(file) : `${import.meta.env.VITE_API_URL}${initialImage}`}
          alt="Foto de Perfil"
          className={`w-${size} h-${size} rounded-full object-cover border-2 border-white shadow-md`}
        />
        <label
          htmlFor="upload-avatar"
          className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center"
          title="Alterar foto"
        >
          <Camera />
        </label>
        <input
          id="upload-avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {showLabel && <p className="text-sm text-gray-600">{label}</p>}
    </div>
  );
};

export default AvatarUpload;