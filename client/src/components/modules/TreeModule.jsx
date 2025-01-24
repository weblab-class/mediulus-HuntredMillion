import React, { useState, useEffect } from "react";
import { Paper, Slider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./TreeModule.css";

const TreeModule = ({ id, onDelete, onUpdate, initialValues = {} }) => {
  const [numLines, setNumLines] = useState(initialValues.numLines || 2);
  const [angle, setAngle] = useState(initialValues.angle || 45);
  const [decay, setDecay] = useState(initialValues.decay || 0.5);

  // Update parent component whenever values change
  useEffect(() => {
    onUpdate(id, { numLines, angle, decay });
  }, [numLines, angle, decay]);

  const handleNumLines = (event, newValue) => {
    setNumLines(newValue);
    // const maxAngle = 360 / newValue;
    // if (angle > maxAngle) {
    //   setAngle(Math.round(maxAngle / 2));
    // }
  };

  const handleAngle = (event, newValue) => {
    setAngle(newValue);
    if (newValue === 360) {
      // console.log("#1 angle is 360");
    }
  };

  const handleDecay = (event, newValue) => {
    setDecay(newValue);
  };

  return (
    <Paper elevation={2} className="tree-module">
      <div className="tree-module-header">
        <div className="tree-module-title">Tree Module {id}</div>
        <IconButton size="small" onClick={() => onDelete(id)} className="tree-module-close">
          <CloseIcon />
        </IconButton>
      </div>

      <div className="tree-module-controls">
        <div className="tree-module-control">
          <div className="tree-module-label">Number of Branches</div>
          <Slider
            className="tree-module-slider"
            value={numLines}
            onChange={handleNumLines}
            min={1}
            max={10}
            step={1}
            marks
            valueLabelDisplay="auto"
          />
        </div>

        <div className="tree-module-control">
          <div className="tree-module-label">Angle Between Branches</div>
          <Slider
            className="tree-module-slider"
            value={angle}
            onChange={handleAngle}
            min={0}
            max={360}
            step={1}
            valueLabelDisplay="auto"
          />
        </div>

        <div className="tree-module-control">
          <div className="tree-module-label">Decay Factor</div>
          <Slider
            className="tree-module-slider"
            value={decay}
            onChange={handleDecay}
            min={0}
            max={1}
            step={0.01}
            valueLabelDisplay="auto"
          />
        </div>
      </div>
    </Paper>
  );
};

export default TreeModule;
