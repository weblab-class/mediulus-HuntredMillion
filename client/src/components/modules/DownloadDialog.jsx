import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
  Box,
} from "@mui/material";

const DownloadDialog = ({ open, onClose, onDownload }) => {
  const [quality, setQuality] = useState(4);
  const [includeBackground, setIncludeBackground] = useState(true);

  const handleDownload = () => {
    onDownload({
      scale: quality,
      includeBackground,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Download Options</DialogTitle>
      <DialogContent>
        <Box sx={{ width: 300, mt: 2 }}>
          <Typography gutterBottom>Image Quality</Typography>
          <Slider
            value={quality}
            onChange={(_, value) => setQuality(value)}
            step={1}
            marks={[
              { value: 1, label: "1x" },
              { value: 2, label: "2x" },
              { value: 4, label: "4x" },
              { value: 8, label: "8x" },
              { value: 16, label: "16x" },
            ]}
            min={1}
            max={16}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value}x`}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Higher quality exports may take longer to process
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={includeBackground}
                onChange={(e) => setIncludeBackground(e.target.checked)}
              />
            }
            label="Include Background"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDownload} variant="contained">
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
