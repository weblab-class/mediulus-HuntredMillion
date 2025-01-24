import React, { useState, useEffect } from "react";
import Controls from "../modules/Controls";
import Display from "../modules/Display";
import "./Create.css";

const Create = () => {
  const [drawMode, setDrawMode] = useState("line");
  const [numIters, setNumIters] = useState(1);
  const [treeModuleParallels, setTMPs] = useState([]);
  const [lines, setLines] = useState({
    initial: [],
    branches: {}, // Will store lines for each branch, keyed by branch ID
  });

  const generateInitialLine = () => {
    const initialLength = 250;
    return [
      {
        x1: -initialLength,
        y1: 0,
        x2: 0,
        y2: 0,
        generation: 0,
      },
    ];
  };

  const generateFractalLines = (branchId = null) => {
    // If no branchId provided, regenerate everything
    if (branchId === null) {
      const newLines = {
        initial: generateInitialLine(),
        branches: {},
      };

      // Generate lines for each branch
      treeModuleParallels.forEach((branch) => {
        newLines.branches[branch.id] = generateBranchLines(branch, newLines.initial);
      });

      setLines(newLines);
      return;
    }

    // If branchId provided, only update that branch's lines
    setLines((prevLines) => ({
      ...prevLines,
      branches: {
        ...prevLines.branches,
        [branchId]: generateBranchLines(
          treeModuleParallels.find((b) => b.id === branchId),
          prevLines.initial
        ),
      },
    }));
  };

  const generateBranchLines = (branch, initialLines) => {
    const branchLines = [];
    const initialLength = 250;

    // Generate lines for each tree module in the branch
    branch.treeModules.forEach((module) => {
      for (let iter = 0; iter < branch.numIters; iter++) {
        const newLines = [];
        const prevGenLines =
          iter === 0 ? initialLines : branchLines.filter((line) => line.generation === iter);

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
        branchLines.push(...newLines);
      }
    });

    return branchLines;
  };

  useEffect(() => {
    generateFractalLines();
  }, []); // Initial generation

  // Add effect to watch for TMP changes
  useEffect(() => {
    const updatedBranch = treeModuleParallels.find((tmp) => tmp.id === lastUpdatedId);
    if (updatedBranch) {
      generateFractalLines(updatedBranch.id);
    }
  }, [treeModuleParallels]); // Regenerate when TMPs change

  // Add state to track which branch was last updated
  const [lastUpdatedId, setLastUpdatedId] = useState(null);

  // Modify handleTMPUpdate to track the last updated branch
  const handleTMPUpdate = (id, updates) => {
    setLastUpdatedId(id);
    setTMPs((prevModules) =>
      prevModules.map((module) => (module.id === id ? { ...module, ...updates } : module))
    );
  };

  return (
    <div className="create-container">
      <div className="create-content">
        <div className="create-display-wrapper">
          <Display
            lines={
              drawMode === "point"
                ? Object.values(lines.branches).flat()
                : [...lines.initial, ...Object.values(lines.branches).flat()]
            }
            drawMode={drawMode}
            startPoint={drawMode === "point" ? { x: 0, y: 0 } : null}
          />
        </div>
        <div className="create-controls-wrapper">
          <Controls
            drawMode={drawMode}
            setDrawMode={setDrawMode}
            numIters={numIters}
            setNumIters={setNumIters}
            treeModuleParallels={treeModuleParallels}
            setTMPs={setTMPs}
            onTMPUpdate={handleTMPUpdate}
            setLines={setLines}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
