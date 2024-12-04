"use client";

import { useEffect, useState } from 'react';

const DateTime = () => {
  const [dateTime, setDateTime] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date().toLocaleString();
    setDateTime(now);
  }, []);

  if (!dateTime) {
    return null; // or a loading spinner
  }

  return <span>{dateTime}</span>;
};

export default DateTime;