/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Engine, Render, World, Bodies, Body, Vector, Runner, Events } from 'matter-js';
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from "@/components/ui/button"

type Velocity = {
  x: number;
  y: number;
};

type Position = {
  x: number;
  y: number;
};

type PhysicsObject = {
  id?: string;
  weight: number;
  velocity: Velocity;
  position: Position;
};

type PhysicsSimulatorProps = {
  objects: PhysicsObject[];
};

const PhysicsSimulator: React.FC<PhysicsSimulatorProps> = ({ objects }) => {
  const scene = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const runnerRef = useRef<Runner | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const matterObjectsRef = useRef<{ body: any; size: number; weight: number; initialPosition: Position }[]>([]);
  const initialObjectsRef = useRef<PhysicsObject[]>([]);

  const originalWidth = 370;
  const originalHeight = 250;

  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: originalWidth,
    height: originalHeight,
  });

  const updateDimensions = () => {
    if (scene.current) {
      const { clientWidth, clientHeight } = scene.current.parentElement || scene.current;
      const aspectRatio = originalWidth / originalHeight;
      let newWidth = clientWidth;
      let newHeight = clientWidth / aspectRatio;
      if (newHeight > (clientHeight || originalHeight)) {
        newHeight = clientHeight || originalHeight;
        newWidth = newHeight * aspectRatio;
      }
      setDimensions({
        width: newWidth,
        height: newHeight,
      });
    }
  };

  useEffect(() => {
    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    initialObjectsRef.current = JSON.parse(JSON.stringify(objects));

    const engine = Engine.create({
      gravity: { x: 0, y: 0 },
    });
    engineRef.current = engine;

    const { width, height } = dimensions;

    const render = Render.create({
      element: scene.current!,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#f0f0f0',
        pixelRatio: 1,
      },
    });
    renderRef.current = render;
    Render.run(render);

    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;

    const matterObjects = initialObjectsRef.current.map((obj) => {
      const size = Math.sqrt(obj.weight) * 5 * Math.min(scaleX, scaleY);
      const body = Bodies.circle(
        obj.position.x * scaleX,
        obj.position.y * scaleY,
        size,
        {
          restitution: 0,
          friction: 0,
          frictionAir: 0,
          slop: 0,
          inertia: Infinity,
          render: {
            fillStyle: '#3490dc',
          },
        }
      );
      Body.setVelocity(body, { x: obj.velocity.x / 60, y: obj.velocity.y / 60 });
      World.add(engine.world, body);
      return { body, size, weight: obj.weight, initialPosition: obj.position };
    });

    matterObjectsRef.current = matterObjects;

    Events.on(render, 'afterRender', () => {
      const context = render.context;
      if (!context) return;
      matterObjectsRef.current.forEach(({ body, size, weight }) => {
        const pos = body.position;
        const vel = body.velocity;

        const velocityMagnitude = Vector.magnitude(vel);
        const arrowLength = velocityMagnitude * 10;

        if (arrowLength > 0) {
          const angle = Math.atan2(vel.y, vel.x);
          context.beginPath();
          context.moveTo(pos.x, pos.y);
          context.lineTo(pos.x + arrowLength * Math.cos(angle), pos.y + arrowLength * Math.sin(angle));

          const headLength = 5;
          context.lineTo(
            pos.x + (arrowLength - headLength) * Math.cos(angle - Math.PI / 6),
            pos.y + (arrowLength - headLength) * Math.sin(angle - Math.PI / 6)
          );
          context.moveTo(pos.x + arrowLength * Math.cos(angle), pos.y + arrowLength * Math.sin(angle));
          context.lineTo(
            pos.x + (arrowLength - headLength) * Math.cos(angle + Math.PI / 6),
            pos.y + (arrowLength - headLength) * Math.sin(angle + Math.PI / 6)
          );
          context.strokeStyle = '#ff0000';
          context.lineWidth = 2;
          context.stroke();
        }

        context.font = '12px Arial';
        context.fillStyle = '#000';
        context.textAlign = 'center';
        context.fillText(weight.toString(), pos.x, pos.y - size - 10);
      });
    });

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: width, y: height },
    });

    return () => {
      Render.stop(render);
      World.clear(engine.world, false);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  useEffect(() => {
    if (isRunning) {
      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, engineRef.current!);
    } else {
      if (runnerRef.current) {
        Runner.stop(runnerRef.current);
        runnerRef.current = null;
      }
    }
  }, [isRunning]);

  const handlePlayPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    const { width, height } = dimensions;
    const scaleX = width / originalWidth;
    const scaleY = height / originalHeight;

    matterObjectsRef.current.forEach((obj, index) => {
      const initial = initialObjectsRef.current[index];
      Body.setPosition(obj.body, { x: initial.position.x * scaleX, y: initial.position.y * scaleY });
      Body.setVelocity(obj.body, { x: initial.velocity.x / 60, y: initial.velocity.y / 60 });
      Body.setAngularVelocity(obj.body, 0);
      Body.setAngle(obj.body, 0);
      // Reset size if needed
      // Note: Matter.js doesn't support dynamic resizing out of the box
      // You might need to remove and recreate the body if resizing is required
    });

    // Optionally, reset the engine's timing if needed
    Engine.update(engineRef.current!, 1000 / 60);

    // If the simulation isn't running, ensure it's stopped
    if (!isRunning && runnerRef.current) {
      Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl">
      <div
        ref={scene}
        className="border border-gray-500"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`
        }}
      ></div>
      <div className="mt-4 flex space-x-2">
      <Button onClick={handlePlayPause}>
          {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isRunning ? 'Pause' : 'Play'}
        </Button>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        {/* <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isRunning ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button> */}
      </div>
    </div>
  );
};

export default PhysicsSimulator;