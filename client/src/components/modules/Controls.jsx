import React, { useEffect, useState, useContext } from "react";
import "./Controls.css";
import {
  Paper,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Slider,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TreeModuleParallel from "./TreeModuleParallel";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IosShareIcon from "@mui/icons-material/IosShare";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadFractal, createThumbnail } from "../../utils/exportUtils";
import DownloadDialog from "./DownloadDialog";
import { post } from "../../utilities";
import { UserContext } from "../App";

const Controls = ({
  drawMode,
  setDrawMode,
  numIters,
  setNumIters,
  initWidth,
  setInitWidth,
  treeModuleParallels,
  setTMPs,
  onTMPUpdate,
  calculateAllBranchesLines,
  generateFractalLines,
  linesRef,
  zoom,
  pan,
  viewState,
}) => {
  const { userId } = useContext(UserContext);
  const [title, setTitle] = useState("Untitled Fractal");
  const [description, setDescription] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [fractalId, setFractalId] = useState(null);

  const handleDrawModeChange = (event) => {
    setDrawMode(event.target.value);
  };

  const handleAddTMP = () => {
    const defaultTreeModule = {
      id: Date.now(),
      name: "Segment 1",
      numLines: 2,
      angle: 45,
      decay: 0.5,
      widthDecay: 1,
      color: "#000000",
    };
    const totalLines = calculateAllBranchesLines([
      ...treeModuleParallels,
      {
        numIters: 1,
        treeModules: [defaultTreeModule],
      },
    ]);

    if (totalLines > 10000000) {
      console.warn("Cannot add branch - would exceed line limit");
      return;
    }

    const newBranchNumber = treeModuleParallels.length + 1;
    setTMPs([
      ...treeModuleParallels,
      {
        id: Date.now(),
        name: `Branch ${newBranchNumber}`,
        numIters: 1,
        initWidth: 2,
        treeModules: [defaultTreeModule],
      },
    ]);
  };

  const handleDeleteTMP = (id) => {
    setTMPs(treeModuleParallels.filter((branch) => branch.id !== id));
  };

  // Add useEffect to watch for treeModuleParallels changes
  useEffect(() => {
    // When treeModuleParallels changes, regenerate lines
    generateFractalLines(null);
  }, [treeModuleParallels]);

  // Create new fractal only when we have a userId
  useEffect(() => {
    if (userId) {
      post("/api/createFractal", { userId: userId })
        .then((fractal) => {
          setFractalId(fractal._id);
        })
        .catch((err) => {
          console.error("Failed to create fractal:", err);
        });
    }
  }, [userId]);

  // Auto-save only when we have both fractalId and userId
  useEffect(() => {
    if (!fractalId || !userId) return;

    const updateFractal = async () => {
      console.log("Saving fractal...", {
        id: fractalId,
        title,
        description,
        backgroundColor,
        drawMode,
        modules: treeModuleParallels.length,
      });

      const canvas = document.querySelector(".display-canvas");
      const thumbnail = await createThumbnail({
        canvas,
        linesRef,
        viewState,
        backgroundColor,
      });

      post("/api/updateFractal", {
        _id: fractalId,
        creator_id: userId,
        title,
        description,
        backgroundColor,
        drawMode,
        treeModuleParallels,
        thumbnail,
      })
        .then(() => {
          console.log("Fractal saved successfully!");
        })
        .catch((err) => {
          console.error("Failed to save fractal:", err);
        });
    };

    const saveTimeout = setTimeout(updateFractal, 1000);

    return () => clearTimeout(saveTimeout);
  }, [fractalId, userId, title, description, backgroundColor, drawMode, treeModuleParallels]);

  const handleDownloadClick = () => {
    setDownloadDialogOpen(true);
  };

  const handleDownload = async (options) => {
    const canvas = document.querySelector(".display-canvas");
    await downloadFractal({
      canvas,
      linesRef,
      viewState,
      backgroundColor: options.includeBackground ? backgroundColor : null,
      title,
      scale: options.scale,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out the fractal I made on Fractal Flow!",
          url: "https://fractal.example.com/12345", // Replace with actual URL when ready
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <Paper elevation={3} className="controls-container">
      <div className="controls-section">
        <div className="controls-section-header">
          <div className="controls-section-title">
            <IconButton
              size="small"
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className={`expand-button ${isSettingsExpanded ? "expanded" : ""}`}
            >
              <ChevronRightIcon />
            </IconButton>
            <Typography variant="h6">Global Settings</Typography>
          </div>
        </div>

        {isSettingsExpanded && (
          <div className="controls-section-content">
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <FormLabel>Background Color</FormLabel>
              <div className="controls-color-picker">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="controls-color-input"
                />
                <Typography variant="body2">{backgroundColor}</Typography>
              </div>
            </FormControl>

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Start With</FormLabel>
              <RadioGroup row value={drawMode} onChange={handleDrawModeChange}>
                <FormControlLabel value="line" control={<Radio size="small" />} label="Line" />
                <FormControlLabel value="point" control={<Radio size="small" />} label="Point" />
              </RadioGroup>
            </FormControl>
          </div>
        )}
      </div>

      <Divider />

      <div className="controls-module-header">
        <Typography>Branches: {treeModuleParallels.length}</Typography>
        <IconButton onClick={handleAddTMP} className="controls-add-button">
          <AddIcon />
        </IconButton>
      </div>

      <div className="controls-module-list">
        {treeModuleParallels.map((module) => (
          <TreeModuleParallel
            key={module.id}
            id={module.id}
            onDelete={handleDeleteTMP}
            onUpdate={onTMPUpdate}
            initialValues={module}
            calculateAllBranchesLines={calculateAllBranchesLines}
            treeModuleParallels={treeModuleParallels}
          />
        ))}
      </div>

      <Divider />

      <div className="controls-actions">
        <IconButton onClick={handleDownloadClick} className="controls-download-button">
          <DownloadIcon />
        </IconButton>
        <button className="controls-post-button">POST</button>
        <IconButton onClick={handleShare} className="controls-export-button">
          <IosShareIcon />
        </IconButton>
      </div>

      <DownloadDialog
        open={downloadDialogOpen}
        onClose={() => setDownloadDialogOpen(false)}
        onDownload={handleDownload}
      />
    </Paper>
  );
};

export default Controls;
