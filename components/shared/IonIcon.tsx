import React from 'react';

interface IonIconProps {
  name: string;
  style?: React.CSSProperties;
  className?: string;
}

const IonIcon: React.FC<IonIconProps> = ({ name, style, className }) => {
  const CustomElement = 'ion-icon' as any;
  return <CustomElement name={name} style={style} className={className} />;
};

export default IonIcon;
