import React from 'react'

export const Layout: React.FC<{ children?: React.ReactNode }> = ({
  children
}) => (
  <div className="flex items-center min-h-screen flex-col text-zinc-100 bg-[#23272f] font-sans">
    {children}
  </div>
)
