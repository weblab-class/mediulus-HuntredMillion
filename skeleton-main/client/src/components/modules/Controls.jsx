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
import TimelineIcon from "@mui/icons-material/Timeline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TreeModule from "./TreeModule";

const Controls = ({
  drawMode,
  setDrawMode,
  numIters,
  setNumIters,
  treeModules,
  setTreeModules,
  onTreeModuleUpdate,
}) => {
  const handleDrawModeChange = (event, newMode) => {
    if (newMode !== null) {
      setDrawMode(newMode);
    }
  };

  const handleAddTreeModule = () => {
    setTreeModules([
      ...treeModules,
      {
        id: Date.now(),
        numLines: 2,
        angle: 45,
        decay: 0.5,
      },
    ]);
  };

  const handleDeleteTreeModule = (id) => {
    setTreeModules(treeModules.filter((module) => module.id !== id));
  };

  return (
    <Paper elevation={3} className="controls-container">
      <div className="controls-section">
        <Typography className="controls-heading">Global Settings</Typography>
        <div className="controls-section">
          <Typography className="controls-subheading">Number of Iterations</Typography>
          <Slider
            className="controls-slider"
            value={numIters}
            onChange={(e, newValue) => setNumIters(newValue)}
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </div>

        <Typography className="controls-heading">Drawing Mode</Typography>
        <ToggleButtonGroup
          value={drawMode}
          exclusive
          onChange={handleDrawModeChange}
          aria-label="drawing mode"
          className="controls-toggle-group"
        >
          <ToggleButton value="line" aria-label="line mode" className="controls-toggle-button">
            <TimelineIcon />
            <Typography className="controls-toggle-text">Line</Typography>
          </ToggleButton>
          <ToggleButton value="point" aria-label="point mode" className="controls-toggle-button">
            <RadioButtonUncheckedIcon />
            <Typography className="controls-toggle-text">Point</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <Divider className="controls-divider" />

      <div className="controls-module-header">
        <Typography>Tree Modules: {treeModules.length}</Typography>
        <IconButton onClick={handleAddTreeModule} className="controls-add-button">
          <AddIcon />
        </IconButton>
      </div>

      <div className="controls-module-list">
        {treeModules.map((module) => (
          <TreeModule
            key={module.id}
            id={module.id}
            onDelete={handleDeleteTreeModule}
            onUpdate={onTreeModuleUpdate}
            initialValues={module}
          />
        ))}
      </div>
    </Paper>
  );
};

export default Controls;
