import React, { useState, useEffect } from "react";
import Controls from "../modules/Controls";
import Display from "../modules/Display";
import "./Create.css";

const Create = () => {
  const [drawMode, setDrawMode] = useState("line");
  const [numIters, setNumIters] = useState(1);
  const [treeModules, setTreeModules] = useState([]);
  const [lines, setLines] = useState([]);

  const generateFractalLines = () => {
    const allLines = [];
    const initialLength = 250;

    // Add initial horizontal line centered at (0,0)
    allLines.push({
      x1: -initialLength / 2,
      y1: 0,
      x2: initialLength / 2,
      y2: 0,
      generation: 0,
    });

    // Generate lines for each tree module
    treeModules.forEach((module) => {
      for (let iter = 0; iter < numIters; iter++) {
        const newLines = [];
        const prevGenLines = allLines.filter((line) => line.generation === iter);

        prevGenLines.forEach((parentLine) => {
          const baseAngle = Math.atan2(
            parentLine.y2 - parentLine.y1,
            parentLine.x2 - parentLine.x1
          );

          const newLength = initialLength * Math.pow(module.decay, iter + 1);
          const totalSpread = (module.numLines - 1) * module.angle;
          const startAngle = baseAngle - totalSpread / 2;

          for (let i = 0; i < module.numLines; i++) {
            let branchAngle;
            if (module.numLines % 2 === 0) {
              const offset = (i - (module.numLines - 1) / 2) * ((module.angle * Math.PI) / 180);
              branchAngle = baseAngle + offset;
            } else {
              const offset =
                (i - Math.floor(module.numLines / 2)) * ((module.angle * Math.PI) / 180);
              branchAngle = baseAngle + offset;
            }

            const newX = parentLine.x2 + newLength * Math.cos(branchAngle);
            const newY = parentLine.y2 + newLength * Math.sin(branchAngle);

            newLines.push({
              x1: parentLine.x2,
              y1: parentLine.y2,
              x2: newX,
              y2: newY,
              generation: iter + 1,
            });
          }
        });
        allLines.push(...newLines);
      }
    });

    setLines(allLines);
  };

  useEffect(() => {
    generateFractalLines();
  }, [numIters, treeModules]);

  const handleTreeModuleUpdate = (id, updates) => {
    setTreeModules((prevModules) =>
      prevModules.map((module) => (module.id === id ? { ...module, ...updates } : module))
    );
  };

  return (
    <div className="create-container">
      <div className="create-content">
        <div className="create-display-wrapper">
          <Display lines={lines} drawMode={drawMode} />
        </div>
        <div className="create-controls-wrapper">
          <Controls
            drawMode={drawMode}
            setDrawMode={setDrawMode}
            numIters={numIters}
            setNumIters={setNumIters}
            treeModules={treeModules}
            setTreeModules={setTreeModules}
            onTreeModuleUpdate={handleTreeModuleUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
