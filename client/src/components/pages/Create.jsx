import React, { useState, useRef, useEffect } from "react";
import Controls from "../modules/Controls";
import Display from "../modules/Display";
import "./Create.css";

const Create = () => {
  const [drawMode, setDrawMode] = useState("line");
  const [numIters, setNumIters] = useState(1);
  const [treeModuleParallels, setTMPs] = useState([]);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [viewState, setViewState] = useState({ zoom: 1, pan: { x: 0, y: 0 } });

  const generateInitialLine = () => {
    const initialLength = 250;
    return [
      {
        x1: -initialLength,
        y1: 0,
        x2: 0,
        y2: 0,
        generation: 0,
        width: 1,
        color: "#000000",
      },
    ];
  };

  // Initialize linesRef with the initial line
  const linesRef = useRef({
    initial: generateInitialLine(),
    branches: {},
  });

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

      // Store in ref instead of state
      linesRef.current = newLines;
      setRenderTrigger((prev) => prev + 1);
      return;
    }

    // If branchId provided, only update that branch's lines
    const updatedBranch = treeModuleParallels.find((b) => b.id === branchId);
    if (!updatedBranch) return;

    // Generate new lines and update just that branch
    linesRef.current = {
      ...linesRef.current,
      branches: {
        ...linesRef.current.branches,
        [branchId]: generateBranchLines(updatedBranch, linesRef.current.initial),
      },
    };

    // Trigger re-render
    setRenderTrigger((prev) => prev + 1);
  };

  const generateBranchLines = (branch, initialLines) => {
    const branchLines = [];
    const initialLength = 250;
    const initialWidth = branch.initWidth;
    let currentGenLines = initialLines;
    const BATCH_SIZE = 1000;

    // For each iteration
    for (let iter = 0; iter < branch.numIters; iter++) {
      const module = branch.treeModules[iter % branch.treeModules.length];
      const newLines = [];

      currentGenLines.forEach((parentLine) => {
        const baseAngle = Math.atan2(parentLine.y2 - parentLine.y1, parentLine.x2 - parentLine.x1);

        const newLength = initialLength * Math.pow(module.decay, iter + 1);
        const newWidth = (parentLine.width || initialWidth) * module.widthDecay;

        for (let i = 0; i < module.numLines; i++) {
          let branchAngle;
          if (module.numLines === 1) {
            branchAngle = baseAngle - (module.angle * Math.PI) / 180;
          } else if (module.numLines % 2 === 0) {
            const offset = (i - (module.numLines - 1) / 2) * ((module.angle * Math.PI) / 180);
            branchAngle = baseAngle + offset;
          } else {
            const offset = (i - Math.floor(module.numLines / 2)) * ((module.angle * Math.PI) / 180);
            branchAngle = baseAngle + offset;
          }

          const newX = parentLine.x2 + newLength * Math.cos(branchAngle);
          const newY = parentLine.y2 + newLength * Math.sin(branchAngle);

          newLines.push({
            x1: parentLine.x2,
            y1: parentLine.y2,
            x2: newX,
            y2: newY,
            width: newWidth,
            color: module.color || "#000000",
            generation: iter + 1,
          });
        }
      });

      // Push newLines to branchLines in chunks
      for (let i = 0; i < newLines.length; i += BATCH_SIZE) {
        const chunk = newLines.slice(i, i + BATCH_SIZE);
        branchLines.push(...chunk);
      }

      // Update currentGenLines for next iteration
      currentGenLines = newLines;
    }

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
    setLastUpdatedId(id); //max update dept exceeded warning here.
    setTMPs((prevModules) =>
      prevModules.map((module) => (module.id === id ? { ...module, ...updates } : module))
    );
  };

  const calculateTotalLines = (branch) => {
    let total = 1; // Start with initial line
    let currentGen = 1; // Number of lines in current generation

    for (let i = 0; i < branch.numIters; i++) {
      const module = branch.treeModules[i % branch.treeModules.length];
      currentGen *= module.numLines; // Each line splits into numLines new lines
      total += currentGen; // Add this generation's lines to total
    }

    return total;
  };

  const calculateAllBranchesLines = (branches, newBranch = null, newIters = null) => {
    let total = 0;
    console.log("check1");
    branches.forEach((branch) => {
      if (branch.id === newBranch?.id) {
        total += calculateTotalLines({ ...branch, numIters: newIters });
      } else {
        total += calculateTotalLines(branch);
      }
    });
    console.log(treeModuleParallels);
    console.log(total);
    return total;
  };

  return (
    <div className="create-container">
      <div className="create-content">
        <div className="create-display-wrapper">
          <Display
            lines={
              drawMode === "point"
                ? Object.values(linesRef.current.branches).flat()
                : [...linesRef.current.initial, ...Object.values(linesRef.current.branches).flat()]
            }
            drawMode={drawMode}
            startPoint={drawMode === "point" ? { x: 0, y: 0 } : null}
            onViewChange={setViewState}
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
            calculateAllBranchesLines={calculateAllBranchesLines}
            generateFractalLines={generateFractalLines}
            linesRef={linesRef}
            viewState={viewState}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
