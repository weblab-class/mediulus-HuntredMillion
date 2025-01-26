import React, { useEffect } from "react";
import "./Controls.css";
import {
  Paper,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Slider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TreeModuleParallel from "./TreeModuleParallel";

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
}) => {
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

  return (
    <Paper elevation={3} className="controls-container">
      <div className="controls-section">
        <div className="controls-radio-group">
          <span className="controls-radio-label">Start With:</span>
          <label className="controls-radio-option">
            <input
              type="radio"
              value="line"
              checked={drawMode === "line"}
              onChange={handleDrawModeChange}
              name="drawMode"
            />
            <span>Line</span>
          </label>
          <label className="controls-radio-option">
            <input
              type="radio"
              value="point"
              checked={drawMode === "point"}
              onChange={handleDrawModeChange}
              name="drawMode"
            />
            <span>Point</span>
          </label>
        </div>
      </div>

      <Divider className="controls-divider" />

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
    </Paper>
  );
};

export default Controls;
