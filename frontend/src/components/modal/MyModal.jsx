import React from 'react';
import classes from './MyModal.module.css';

export const MyModal = ({children, visible, setVisible}) => {

  const rootClasses = [classes.myModal];
  if(visible) {
    rootClasses.push(classes.active);
  }

  return (
    <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
        <div className={classes.myModalContent} onClick={event => event.stopPropagation()}>
          {children}
        </div>
    </div>
  )
}
