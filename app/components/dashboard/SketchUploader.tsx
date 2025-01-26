import React, { useState } from 'react';

interface SketchUploaderProps {
  onSketchUploaded: (file: File) => void;
}

const SketchUploader: React.FC<SketchUploaderProps> = ({ onSketchUploaded }) => {
  const [sketch, setSketch] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSketch(file);
      onSketchUploaded(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {sketch && <p>Sketch uploaded: {sketch.name}</p>}
    </div>
  );
};

export default SketchUploader;
