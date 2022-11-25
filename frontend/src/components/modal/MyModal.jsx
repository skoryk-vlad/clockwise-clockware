import React, { useEffect, useRef, useState } from 'react';
import classes from './MyModal.module.css';

export const MyModal = ({ children, visible, setVisible, className }) => {
  const rootClasses = [classes.myModal];
  if (visible) rootClasses.push(classes.active);
  if (className) rootClasses.push(classes[className]);

  const [alignItems, setAlignItems] = useState('center');
  const elementRef = useRef(null);

  const handleResize = () => {
    if (elementRef.current.clientHeight + 20 > window.innerHeight) {
      setAlignItems('flex-start');
    } else {
      setAlignItems('center');
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={rootClasses.join(' ')} onClick={() => setVisible(false)} style={{ alignItems: alignItems }}>
      <div className={classes.myModalContent} onClick={event => event.stopPropagation()} ref={elementRef}>
        {children}
      </div>
    </div>
  )
}
