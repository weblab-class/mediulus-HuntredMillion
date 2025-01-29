import React, { useState, useEffect } from "react";
import { Paper, Slider, IconButton, Snackbar, Alert, Typography, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import TreeModule from "./TreeModule";
import "./TreeModuleParallel.css";

const TreeModuleParallel = ({
  id,
  onDelete,
  onUpdate,
  initialValues,
  calculateAllBranchesLines,
  treeModuleParallels = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState(initialValues.name || `Branch ${id}`);
  const [numIters, setNumIters] = useState(initialValues.numIters || 1);
  const [initWidth, setInitWidth] = useState(initialValues.initWidth || 2);
  const [treeModules, setTreeModules] = useState(
    initialValues.treeModules || [
      {
        id: Date.now(),
        numLines: 2,
        angle: 45,
        decay: 0.5,
        widthDecay: 1,
        color: "#000000",
      },
    ]
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "warning",
  });

  // Update parent component whenever values change
  useEffect(() => {
    onUpdate(id, {
      name,
      numIters,
      initWidth,
      treeModules,
    });
  }, [name, numIters, initWidth, treeModules]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showLimitWarning = (message) => {
    console.warn(message);
    setSnackbar({
      open: true,
      message,
      severity: "warning",
    });
  };

  const handleAddTreeModule = () => {
    const newSegmentNumber = treeModules.length + 1;
    setTreeModules([
      ...treeModules,
      {
        id: Date.now(),
        name: `Segment ${newSegmentNumber}`,
        numLines: 2,
        angle: 45,
        decay: 0.5,
        widthDecay: 1,
        color: "#000000",
      },
    ]);
  };

  const handleDeleteTreeModule = (moduleId) => {
    setTreeModules(treeModules.filter((module) => module.id !== moduleId));
    // The useEffect will trigger onUpdate, but we need to ensure it happens
    // after the state update is complete
    setTimeout(() => {
      onUpdate(id, {
        numIters,
        treeModules: treeModules.filter((module) => module.id !== moduleId),
      });
    }, 0);
  };

  const handleTreeModuleUpdate = (moduleId, values) => {
    const updatedTreeModules = treeModules.map((module) =>
      module.id === moduleId ? { ...module, ...values } : module
    );

    // // Check if numLines is being updated
    // if (values.numLines) {
    //   const totalLines = calculateAllBranchesLines(
    //     treeModuleParallels,
    //     { id, treeModules: updatedTreeModules },
    //     numIters
    //   );

    //   if (totalLines > 10000000) {
    //     showLimitWarning("Cannot update - would exceed line limit 1");
    //     return;
    //   }
    // }

    setTreeModules(updatedTreeModules);
  };

  const handleNumItersChange = (e, newValue) => {
    // Calculate total lines if we were to make this change
    const totalLines = calculateAllBranchesLines(
      treeModuleParallels,
      { id, treeModules },
      newValue
    );

    if (totalLines > 10000000) {
      showLimitWarning("Cannot increase iterations - would exceed line limit");
      return;
    }

    setNumIters(newValue);
  };

  const checkLineLimit = (moduleId, updates) => {
    // Only check if numLines is being updated

    const updatedTreeModules = treeModules.map((module) =>
      module.id === moduleId ? { ...module, ...updates } : module
    );

    // Create temporary updated version of treeModuleParallels
    const updatedTMPs = treeModuleParallels.map((branch) =>
      branch.id === id ? { ...branch, treeModules: updatedTreeModules } : branch
    );

    const totalLines = calculateAllBranchesLines(
      updatedTMPs,
      { id, treeModules: updatedTreeModules },
      numIters
    );
    if (totalLines > 10000000) {
      showLimitWarning("Cannot update - would exceed line limit 2");
      return false;
    }
    return true;
  };

  return (
    <Paper elevation={2} className="tree-module">
      <div className="tree-module-header">
        <div className="tree-module-title-group">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="tree-module-title-input"
          />
        </div>
        <div className="tree-module-actions">
          <Tooltip title="Delete Branch">
            <IconButton
              size="small"
              onClick={() => onDelete(id)}
              className="tree-module-parallel-close"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div className="tree-module-controls">
        <div className="tree-module-control">
          <div className="tree-module-label">Number of Iterations</div>
          <Slider
            className="tree-module-slider"
            value={numIters}
            onChange={handleNumItersChange} //(e, newValue) => setNumIters(newValue)
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </div>

        <div className="tree-module-control">
          <div className="tree-module-label">Initial Width</div>
          <Slider
            className="tree-module-slider"
            value={initWidth}
            onChange={(e, newValue) => setInitWidth(newValue)}
            min={0.1}
            max={10}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </div>
      </div>

      <div className="tree-module-segments-header">
        <div className="segments-title-group">
          <Tooltip title={isExpanded ? "Collapse Segments" : "Expand Segments"}>
            <IconButton
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`expand-button ${isExpanded ? "expanded" : ""}`}
            >
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1">Segments: {treeModules.length}</Typography>
        </div>
        {isExpanded && (
          <Tooltip title="Add Segment">
            <IconButton onClick={handleAddTreeModule} className="tree-module-add" size="small">
              <AddIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>

      {isExpanded && (
        <div className="tree-module-list">
          {treeModules.map((module) => (
            <TreeModule
              key={module.id}
              id={module.id}
              onDelete={handleDeleteTreeModule}
              onUpdate={handleTreeModuleUpdate}
              initialValues={module}
              checkUpdate={checkLineLimit}
            />
          ))}
        </div>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default TreeModuleParallel;
