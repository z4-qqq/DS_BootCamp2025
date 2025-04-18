import React from 'react';

const BackgroundScene: React.FC = () => (
  <svg
    viewBox="0 0 1000 600"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      opacity: 0.15,
      pointerEvents: 'none',
    }}
  >
    <g fill="none" stroke="#000" strokeWidth="2">
      {/* Голова женщины */}
      <polygon points="800,200 820,180 840,200 830,230 810,230" fill="#333" />
      {/* Волосы */}
      <polygon points="820,180 830,160 850,180 840,200" fill="#111" />

      {/* Тело */}
      <polygon points="810,230 830,230 850,270 790,270" fill="#FECB2F" />

      {/* Резюме в руке */}
      <rect x="760" y="300" width="80" height="100" fill="white" stroke="#222" />
      <circle cx="800" cy="330" r="12" fill="#ccc" />
      <line x1="780" y1="360" x2="820" y2="360" stroke="#666" />
      <line x1="780" y1="380" x2="820" y2="380" stroke="#666" />

      {/* Диалоговые окна слева */}
      <rect x="100" y="120" width="220" height="80" rx="10" fill="#f6f6f6" stroke="#aaa" />
      <line x1="120" y1="150" x2="280" y2="150" stroke="#888" />
      <line x1="120" y1="170" x2="250" y2="170" stroke="#888" />

      <rect x="150" y="240" width="200" height="60" rx="10" fill="#fff" stroke="#bbb" />
      <line x1="170" y1="260" x2="320" y2="260" stroke="#aaa" />
    </g>
  </svg>
);

export default BackgroundScene;
