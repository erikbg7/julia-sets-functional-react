import React, { useState } from "react";
import styled from "styled-components";
import * as math from "mathjs";

// https://en.wikipedia.org/wiki/Julia_set
// https://karlsims.com/julia.html
// http://paulbourke.net/fractals/juliaset/
// http://www.malinc.se/m/JuliaSets.php

const resolution = 0.005; // Less resolution would freeze the browser, 0.01 works smooth

const sets = [
  {
    power: 2,
    constant: 0.279,
  },
  {
    power: 3,
    constant: 0.4,
  },
  {
    power: 6,
    constant: 0.59,
  },
  {
    power: 2,
    constant: math.complex(0.279, 0.467),
  },
  {
    power: 2,
    constant: math.complex(0.285, -0.01),
  },
];

function Iterate(re, im, iteration, active) {
  const z = math.complex(re, im);
  if (iteration === 256 || z.abs() > 2) {
    return iteration;
  }
  const zpow = math.add(math.pow(z, sets[active].power), sets[active].constant);
  return Iterate(zpow.re, zpow.im, iteration + 1, active);
}

function getJuliaSet(ref, active) {
  const canvas = ref.current;
  const ctx = canvas.getContext("2d");
  for (let re = -1.2; re <= 1.2; re += resolution) {
    for (let im = -1.2; im <= 1.2; im += resolution) {
      const iteration = Iterate(re, im, 0, active);
      ctx.fillStyle = `hsl(${iteration * 10}, 100%, 50%)`;
      ctx.fillRect(re * 250 + 300, im * 250 + 300, 2, 2);
    }
  }
}

export const JuliaSetViewer = () => {
  const [activeFn, setActiveFn] = useState(-1);
  const [execTime, setExecTime] = useState("");
  const canvasRef = React.useRef(null);

  return (
    <>
      <StyledTitle>Julia sets drawn in Canvas</StyledTitle>
      <StyledView>
        <FunctionsWrapper>
          <ActiveSet>
            {activeFn === -1
              ? "Select a function:"
              : `Function z^${sets[activeFn].power} + ${sets[activeFn].constant} took ${execTime}`}
          </ActiveSet>
          {sets.map((set, index) => (
            <StyledFunction
              key={`julia-${index}`}
              onClick={() => {
                setActiveFn(index);
                const start = performance.now();
                getJuliaSet(canvasRef, index);
                const end = performance.now();
                setExecTime(`${Math.round(end - start) / 1000}s`);
              }}
            >
              {`f(z) = z^${set.power} + ${set.constant}`}
            </StyledFunction>
          ))}
        </FunctionsWrapper>
        <StyledCanvas ref={canvasRef} width={600} height={600} />
      </StyledView>
    </>
  );
};

const StyledTitle = styled.div`
  width: 100%;
  text-align: center;
  font-family: monospace;
  font-size: 35px;
  margin-top: 75px;
`;

const StyledView = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledCanvas = styled.canvas`
  border: 1px solid #d3d3d3;
  margin-bottom: 20px;
`;

const FunctionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 60px;
  text-align: center;
`;

const ActiveSet = styled.div`
  margin-bottom: 20px;
  height: 60px;
  font-family: monospace;
  font-size: 20px;
  font-weight: bold;
  max-width: 265px;
`;

const StyledFunction = styled.div`
  display: grid;
  width: 265px;
  background-color: rgba(165, 224, 229, 0.8);
  box-shadow: 5px 6px 5px 0px rgba(0, 0, 0, 0.75);
  transition: transform 300ms;
  text-align: center;
  font-weight: bold;
  padding: 20px 0;
  border-radius: 8px;
  margin-bottom: 20px;

  :hover {
    transform: scale(1.05);
    cursor: pointer;
  }

  :active {
    cursor: wait;
  }
`;
