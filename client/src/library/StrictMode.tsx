import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

const StrictMode = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Using a timeout instead of requestAnimationFrame to ensure the component renders
    const timeout = setTimeout(() => setEnabled(true), 0);
    return () => {
      clearTimeout(timeout);
      setEnabled(false);
    };
  }, []);

  // Only render the Droppable when enabled
  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

export default StrictMode;
