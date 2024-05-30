import { Box } from '@totejs/uikit';

export const Result = ({ status }: { status: string }) => {
  if (status === 'success') {
    return <p>✅ Uploaded successfully!</p>;
  } else if (status === 'fail') {
    return <p>❌ Upload failed!</p>;
  } else if (status === 'uploading') {
    return <p>⏳ Uploading started...</p>;
  } else {
    return null;
  }
};
