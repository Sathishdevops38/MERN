import React, { useState, useEffect } from 'react';

function Clock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    function tick() {
      setDate(new Date());
    }
    const timerId = setInterval(tick, 1000);

    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <span className="navbar-text">
      {date.toLocaleTimeString()}
    </span>
  );
}

export default Clock;