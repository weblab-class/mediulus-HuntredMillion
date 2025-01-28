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
import { post, get } from "../../utilities";
import { UserContext } from "../App";
import { useLocation } from "react-router-dom";

const Controls = ({
  drawMode,
  setDrawMode,
  // numIters,
  // setNumIters,
  backgroundColor,
  setBackgroundColor,
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
  const location = useLocation();
  const existingFractalId = location.state?.fractalId;
  const { userId } = useContext(UserContext);
  // const [title, setTitle] = useState("Untitled Fractal");
  const [description, setDescription] = useState("");
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(true);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [fractalId, setFractalId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleDrawModeChange = (event) => {
    setDrawMode(event.target.value);
    if (!isInitialLoad) setHasChanges(true);
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
    if (!isInitialLoad) setHasChanges(true);
  };

  const handleDeleteTMP = (id) => {
    setTMPs(treeModuleParallels.filter((branch) => branch.id !== id));
    if (!isInitialLoad) setHasChanges(true);
  };

  // Add useEffect to watch for treeModuleParallels changes
  useEffect(() => {
    // When treeModuleParallels changes, regenerate lines
    generateFractalLines(null);
  }, [treeModuleParallels]);

  // Load existing fractal data
  useEffect(() => {
    if (existingFractalId) {
      setFractalId(existingFractalId);
      get("/api/fractal", { _id: existingFractalId })
        .then((fractal) => {
          setDescription(fractal.description);
          setBackgroundColor(fractal.backgroundColor);
          setDrawMode(fractal.drawMode);
          setTMPs(fractal.treeModuleParallels);
          setIsInitialLoad(false);
        })
        .catch((err) => {
          console.error("Failed to load fractal:", err);
          setIsInitialLoad(false);
        });
    } else {
      setIsInitialLoad(false);
    }
  }, [existingFractalId]);

  // Modify the fractal creation effect to only trigger on first change
  useEffect(() => {
    if (userId && !existingFractalId && hasChanges && !fractalId) {
      post("/api/createFractal", { userId: userId })
        .then((fractal) => {
          setFractalId(fractal._id);
        })
        .catch((err) => {
          console.error("Failed to create fractal:", err);
        });
    }
  }, [userId, existingFractalId, hasChanges]); // Add hasChanges as dependency

  // Auto-save only when we have both fractalId and userId
  useEffect(() => {
    console.log("Auto-save effect triggered. HasChanges:", hasChanges);
    if (!fractalId || !userId || !hasChanges) {
      console.log("Skipping save because:", { fractalId, userId, hasChanges });
      return;
    }

    const updateFractal = async () => {
      console.log("Starting fractal save...");
      console.log("Saving fractal...", {
        id: fractalId,
        // title,
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
        drawMode,
      });

      try {
        // First update the thumbnail
        if (thumbnail) {
          const formData = new FormData();
          formData.append("thumbnail", thumbnail.blob);

          await fetch(`/api/fractal/${fractalId}/thumbnail`, {
            method: "POST",
            body: formData,
          });
        }

        // Then update the rest of the fractal data
        const response = await post("/api/updateFractal", {
          _id: fractalId,
          creator_id: userId,
          // title,
          description,
          backgroundColor,
          drawMode,
          treeModuleParallels,
        });

        if (!response._id) {
          throw new Error("Failed to update fractal");
        }

        console.log("Fractal saved successfully!");
        setHasChanges(false);
      } catch (error) {
        console.error("Error updating fractal:", error);
      }
    };

    const saveTimeout = setTimeout(updateFractal, 1000);

    return () => clearTimeout(saveTimeout);
  }, [fractalId, userId, description, backgroundColor, drawMode, treeModuleParallels, hasChanges]); //title,

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
      // title,
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
            {/* <TextField
              fullWidth
              label="Title"
              variant="outlined"
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            /> */}

            <TextField
              fullWidth
              label="Description"
              variant="outlined"
              size="small"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (!isInitialLoad) setHasChanges(true);
              }}
              multiline
              rows={3}
              margin="normal"
            />

            <div className="controls-horizontal-group">
              <FormControl fullWidth>
                <FormLabel>Background Color</FormLabel>
                <div className="controls-color-picker">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      if (!isInitialLoad) setHasChanges(true);
                    }}
                    className="controls-color-input"
                  />
                  {/* <Typography variant="button">{backgroundColor}</Typography> */}
                  <span className="global-settings-color-value">{backgroundColor}</span>
                </div>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel>Start With</FormLabel>
                <RadioGroup
                  row
                  value={drawMode}
                  onChange={(e) => {
                    handleDrawModeChange(e);
                    console.log("isInitialLoad", isInitialLoad);
                    if (!isInitialLoad) setHasChanges(true);
                  }}
                >
                  <FormControlLabel value="line" control={<Radio size="small" />} label="Line" />
                  <FormControlLabel value="point" control={<Radio size="small" />} label="Point" />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        )}
      </div>

      <Divider />

      <div className="controls-module-header">
        <Typography variant="h6">Branches: {treeModuleParallels.length}</Typography>
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
