export interface PhysicsObject {
  id: number;
  weight: number; // in kg or any unit
  velocity: {
    x: number;
    y: number;
  };
  position: {
    x: number;
    y: number;
  };
  radius?: number;
  color?: string;
}

export interface PhysicsSimulatorProps {
  objects: PhysicsObject[];
}