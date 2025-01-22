import React from "react";
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
  treeModuleParallels,
  setTMPs,
  onTMPUpdate,
  setLines,
}) => {
  const handleDrawModeChange = (event) => {
    setDrawMode(event.target.value);
  };

  const handleAddTMP = () => {
    const defaultTreeModule = {
      id: Date.now(),
      numLines: 2,
      angle: 45,
      decay: 0.5,
    };
    setTMPs([
      ...treeModuleParallels,
      {
        id: Date.now(),
        numIters: 1,
        treeModules: [defaultTreeModule],
      },
    ]);
  };

  const handleDeleteTMP = (id) => {
    setTMPs(treeModuleParallels.filter((branch) => branch.id !== id));
    setLines((prevLines) => ({
      ...prevLines,
      branches: Object.fromEntries(
        Object.entries(prevLines.branches).filter(([branchId]) => branchId !== id.toString())
      ),
    }));
  };

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
          />
        ))}
      </div>
    </Paper>
  );
};

export default Controls;
