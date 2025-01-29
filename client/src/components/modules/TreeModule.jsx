import React, { useState, useEffect } from "react";
import { Paper, Slider, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import "./TreeModule.css";

const TreeModule = ({ id, onDelete, onUpdate, initialValues = {}, checkUpdate = () => true }) => {
  const [name, setName] = useState(initialValues.name || `Segment ${id}`);
  const [numLines, setNumLines] = useState(initialValues.numLines || 2);
  const [angle, setAngle] = useState(initialValues.angle || 45);
  const [decay, setDecay] = useState(initialValues.decay || 0.5);
  const [widthDecay, setWidthDecay] = useState(initialValues.widthDecay || 1);
  const [color, setColor] = useState(initialValues.color || "#000000");

  // Update parent component whenever values change
  useEffect(() => {
    onUpdate(id, { name, numLines, angle, decay, widthDecay, color });
  }, [name, numLines, angle, decay, widthDecay, color]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNumLines = (event, newValue) => {
    if (checkUpdate(id, { ...initialValues, numLines: newValue })) {
      console.log("check3");
      setNumLines(newValue);
    } else {
      // Force slider back to previous value
      event.target.value = numLines;
    }
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

  const handleWidthDecay = (event, newValue) => {
    setWidthDecay(newValue);
  };

  const handleColorChange = (event) => {
    setColor(event.target.value);
  };

  return (
    <Paper elevation={2} className="tree-module">
      <div className="tree-module-header">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="tree-module-title-input"
        />
        <Tooltip title="Delete Segment">
          <IconButton size="small" onClick={() => onDelete(id)} className="tree-module-close">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
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
          <div className="tree-module-label">Length Decay Factor</div>
          <Slider
            className="tree-module-slider"
            value={decay}
            onChange={handleDecay}
            min={0}
            max={1.5}
            step={0.01}
            valueLabelDisplay="auto"
          />
        </div>

        <div className="tree-module-control">
          <div className="tree-module-label">Width Decay Factor</div>
          <Slider
            className="tree-module-slider"
            value={widthDecay}
            onChange={handleWidthDecay}
            min={0}
            max={1.5}
            step={0.01}
            valueLabelDisplay="auto"
          />
        </div>

        <div className="tree-module-control">
          <div className="tree-module-label">Color</div>
          <div className="tree-module-color-container">
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="tree-module-color-picker"
            />
            <span className="tree-module-color-value">{color}</span>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default TreeModule;
