import React, { useState, useEffect } from "react";
import { Paper, Slider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import TreeModule from "./TreeModule";
import "./TreeModuleParallel.css";

const TreeModuleParallel = ({ id, onDelete, onUpdate, initialValues = {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [numIters, setNumIters] = useState(initialValues.numIters || 1);
  const [treeModules, setTreeModules] = useState(
    initialValues.treeModules || [
      {
        id: Date.now(),
        numLines: 2,
        angle: 45,
        decay: 0.5,
      },
    ]
  );

  // Update parent component whenever values change
  useEffect(() => {
    onUpdate(id, {
      numIters,
      treeModules,
    });
  }, [numIters, treeModules]);

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
    setTreeModules(
      treeModules.map((module) => (module.id === moduleId ? { ...module, ...values } : module))
    );
    if (values.angle === 360) {
      //   console.log("#2 angle is 360");
    }
  };

  return (
    <Paper elevation={2} className="tree-module">
      <div className="tree-module-header">
        <div className="tree-module-title">Branch {id}</div>
        <div className="tree-module-actions">
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`expand-button ${isExpanded ? "expanded" : ""}`}
          >
            <ExpandMoreIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onDelete(id)} className="tree-module-close">
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      <div className="tree-module-controls">
        <div className="tree-module-control">
          <div className="tree-module-label">Number of Iterations</div>
          <Slider
            className="tree-module-slider"
            value={numIters}
            onChange={(e, newValue) => setNumIters(newValue)}
            min={0}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </div>
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
            />
          ))}
          <IconButton onClick={handleAddTreeModule} className="tree-module-add" size="small">
            <AddIcon />
          </IconButton>
        </div>
      )}
    </Paper>
  );
};

export default TreeModuleParallel;
