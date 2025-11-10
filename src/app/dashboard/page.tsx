'use client'

import Builder from './3d/Builder'


export default function DashboardPage() {
  return (
    
    <div className="flex flex-col h-screen">
     

      {/* 3D Builder Canvas */}
      <div className="flex-1">
        <Builder userId="user-id" username="username" />
        
  

      </div>
    </div>
    
  )
}
