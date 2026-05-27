'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';

interface EvidenceUploadProps {
  disputeId: string;
}

export function EvidenceUpload({ disputeId }: EvidenceUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setUploadSuccess(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      if (description) {
        formData.append('description', description);
      }

      await api.disputes.uploadEvidence(disputeId, formData);
      
      setUploadSuccess(true);
      setFiles([]);
      setDescription('');
      
      // Refresh dispute data and timeline
      mutate(['dispute', disputeId]);
      mutate(['dispute-timeline', disputeId]);
      
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to upload evidence:', error);
      alert('Failed to upload evidence. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-ink">Upload Evidence</h3>
      
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description (optional)
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the evidence you're uploading..."
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Files
          </label>
          <div className="flex items-center gap-2">
            <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <Upload size={16} />
              Choose Files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </label>
            <span className="text-sm text-slate-500">
              PDF, JPG, PNG, DOC (max 10MB each)
            </span>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Selected files:</p>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-600" />
                  <span className="text-sm text-slate-700">{file.name}</span>
                  <span className="text-xs text-slate-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {uploadSuccess && (
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-emerald-800">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Evidence uploaded successfully!</span>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload Evidence'}
        </Button>
      </div>
    </Card>
  );
}
