import React from 'react'

const LoadingSpinner = ({ size = 24 }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `${size / 8}px solid #e9ecef`,
    borderTop: `${size / 8}px solid #3498db`,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px'
  }

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-container p {
            margin-top: 16px;
            color: #6c757d;
            font-size: 15px;
            font-weight: 500;
          }
          .loading-container span {
            color: #adb5bd;
            font-size: 13px;
            margin-top: 4px;
          }
        `}
      </style>
      <div style={containerStyle} className="loading-container">
        <div style={spinnerStyle} />
      </div>
    </>
  )
}

export default LoadingSpinner