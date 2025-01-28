import React, { useRef, useState, useEffect, useCallback } from "react";
import "./Display.css";
import { Paper, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import HomeIcon from "@mui/icons-material/Home";

const Display = ({ lines, drawMode, startPoint, backgroundColor = "#FFFFFF" }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);

  const COORD_SYSTEM_SIZE = 1000;

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    // Initial size
    handleResize();

    // Add listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    // Set canvas size to container size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext("2d");

    // Clear with background color
    console.log(backgroundColor);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate center of canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate scale based on the smallest dimension
    const scaleX = canvas.width / COORD_SYSTEM_SIZE;
    const scaleY = canvas.height / COORD_SYSTEM_SIZE;
    const scale = Math.min(scaleX, scaleY);

    ctx.save();

    // Order of transformations:
    ctx.translate(centerX, centerY);
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom * scale, zoom * scale);

    if (drawMode === "point" && startPoint) {
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "black";
      ctx.fill();
    }

    // Draw lines
    ctx.lineWidth = 1 / zoom;
    lines.forEach((line) => {
      if (line.width) {
        ctx.beginPath();
        ctx.lineWidth = line.width;
        ctx.strokeStyle = line.color || "#000000";
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [zoom, pan, lines, dimensions, drawMode, startPoint, backgroundColor]);

  const handleZoom = (delta) => {
    setZoom((prevZoom) => {
      const newZoom = prevZoom * Math.exp(delta);
      const zoomFactor = newZoom / prevZoom;

      // Calculate the scale based on the smallest dimension
      const scaleX = dimensions.width / COORD_SYSTEM_SIZE;
      const scaleY = dimensions.height / COORD_SYSTEM_SIZE;
      const scale = Math.min(scaleX, scaleY);

      // Calculate the center point in our coordinate system
      const centerX = -pan.x / (scale * prevZoom);
      const centerY = -pan.y / (scale * prevZoom);

      // Calculate new pan position to keep the center point fixed
      const newPan = {
        x: -centerX * scale * newZoom,
        y: -centerY * scale * newZoom,
      };

      setPan(newPan);
      return Math.max(newZoom, 0.1);
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Drawing effect remains the same, but let's add wheel zoom support
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      handleZoom(delta);
    };

    canvas.addEventListener("wheel", handleWheel);
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [dimensions]);

  return (
    <Paper elevation={3} className="display-container">
      <canvas
        ref={canvasRef}
        className={`display-canvas ${isDragging ? "dragging" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="display-controls">
        <IconButton onClick={handleReset} size="small" className="display-button">
          <HomeIcon />
        </IconButton>
        <IconButton onClick={() => handleZoom(-0.5)} size="small" className="display-button">
          <RemoveIcon />
        </IconButton>
        <IconButton onClick={() => handleZoom(0.5)} size="small" className="display-button">
          <AddIcon />
        </IconButton>
      </div>
    </Paper>
  );
};

export default Display;
