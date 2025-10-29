import React from 'react';

interface TerminalWindowProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({ 
  children, 
  title = 'Terminal',
  className = ''
}) => {
  return (
    <div className={`bg-black border border-green-500 rounded-lg overflow-hidden ${className}`}>
      {/* Terminal header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 border-b border-green-500">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-green-400 text-sm font-mono">{title}</span>
      </div>
      
      {/* Terminal content */}
      <div className="p-4 font-mono text-green-400 text-sm">
        {children}
      </div>
    </div>
  );
};

interface TerminalPromptProps {
  children: React.ReactNode;
  user?: string;
  host?: string;
  path?: string;
  className?: string;
}

export const TerminalPrompt: React.FC<TerminalPromptProps> = ({ 
  children, 
  user = 'user',
  host = 'localhost',
  path = '~',
  className = ''
}) => {
  return (
    <div className={`${className}`}>
      <span className="text-green-400">[{user}@{host} {path}]$ </span>
      <span className="text-white">{children}</span>
    </div>
  );
};

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={`text-green-300 ${className}`}>
      {children}
    </div>
  );
};

interface TerminalErrorProps {
  children: React.ReactNode;
  className?: string;
}

export const TerminalError: React.FC<TerminalErrorProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={`text-red-400 ${className}`}>
      {children}
    </div>
  );
};

interface TerminalSuccessProps {
  children: React.ReactNode;
  className?: string;
}

export const TerminalSuccess: React.FC<TerminalSuccessProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={`text-green-400 ${className}`}>
      {children}
    </div>
  );
};
