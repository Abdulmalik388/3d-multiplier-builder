'use client'

import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, TransformControls, Stats } from '@react-three/drei'
import { useObjectStore, Object3D } from '@/store/objectStore'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { v4 as uuidv4 } from 'uuid'
import * as THREE from 'three'

interface BuilderProps {
  userId: string
  username: string
}

const furnitureOptions = [
  { type: 'chair', model_url: '/models/chair.png' },
  { type: 'table', model_url: '/models/table.png' },
  { type: 'sofa', model_url: '/models/sofa.png' },
]

export default function Builder({ userId, username }: BuilderProps) {
  const objects = useObjectStore((state) => state.objects)
  const addObject = useObjectStore((state) => state.addObject)
  const updateObject = useObjectStore((state) => state.updateObject)
  const removeObject = useObjectStore((state) => state.removeObject)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedFurniture, setSelectedFurniture] = useState(furnitureOptions[0])
  const [userColor] = useState(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
  const [loadingTextures, setLoadingTextures] = useState(true) // ✅ spinner state

  // 🔄 Fetch and subscribe to realtime updates
  useEffect(() => {
    const fetchObjects = async () => {
      const { data, error } = await supabase.from('furniture_objects').select('*')
      if (error) console.error('Fetch error:', error)
      if (data) useObjectStore.setState({ objects: data })
      setLoadingTextures(false) // ✅ hide spinner after initial fetch
    }
    fetchObjects()

    const channel = supabase
      .channel('furniture_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'furniture_objects' }, (payload) => {
        if (payload.eventType === 'INSERT') addObject(payload.new as Object3D)
        if (payload.eventType === 'UPDATE') updateObject(payload.new.id, payload.new as Object3D)
        if (payload.eventType === 'DELETE') removeObject(payload.old.id)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // 🪑 Add new furniture
  const handlePlaneClick = async (e: any) => {
    e.stopPropagation()
    const newObj: Object3D = {
      id: uuidv4(),
      type: selectedFurniture.type,
      model_url: selectedFurniture.model_url,
      position: [e.point.x, e.point.y + 0.5, e.point.z],
      rotation: [0, 0, 0],
      scale: 1,
      color: userColor,
      user_id: userId,
      username,
    }

    addObject(newObj)
    const { error } = await supabase.from('furniture_objects').insert([newObj])
    if (error) console.error('Insert error:', error)
  }

  // 🗑️ Delete single selected furniture
  const handleDelete = async () => {
    if (!selectedId) return
    removeObject(selectedId)
    setSelectedId(null)
    const { error } = await supabase.from('furniture_objects').delete().eq('id', selectedId)
    if (error) console.error('Delete error:', error)
  }

  // ❌ Delete all furniture (global)
  const handleDeleteAll = async () => {
    const confirmDelete = confirm('Are you sure you want to delete ALL furniture? Everyone will see the change!')
    if (!confirmDelete) return

    useObjectStore.setState({ objects: [] })

    const { error } = await supabase
      .from('furniture_objects')
      .delete()
      .gt('created_at', '1970-01-01T00:00:00Z')

    if (error) console.error('Delete All error:', error)
    else console.log('✅ All furniture deleted globally')
  }

  // 🪞Furniture display component
  const FurniturePlane = ({ obj }: { obj: Object3D }) => {
    const texture = useLoader(
      THREE.TextureLoader,
      obj.model_url,
      undefined,
      () => setLoadingTextures(false) // ✅ hide spinner when texture loads
    )
    return (
      <group>
        <mesh
          position={obj.position}
          rotation={obj.rotation}
          scale={obj.scale}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedId(obj.id)
          }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>

        <mesh position={[obj.position[0], obj.position[1] + 1.2, obj.position[2]]}>
          <planeGeometry args={[0.5, 0.2]} />
          <meshBasicMaterial color={obj.color || 'gray'} />
        </mesh>
      </group>
    )
  }

  return (
    <div className="relative h-full w-full">
      {/* Loading Spinner */}
      {loadingTextures && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Top left controls */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        {furnitureOptions.map((f) => (
          <button
            key={f.type}
            className={`px-3 py-1 rounded ${
              selectedFurniture.type === f.type ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedFurniture(f)}
          >
            {f.type}
          </button>
        ))}

        <button
          onClick={handleDeleteAll}
          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Delete All
        </button>
      </div>

      {/* Delete single button */}
      {selectedId && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Delete Selected
        </button>
      )}

      <Canvas camera={{ position: [5, 5, 5], fov: 60 }} className="h-full w-full">
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <OrbitControls enableZoom enablePan enableRotate />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
          receiveShadow
          onClick={handlePlaneClick}
        >
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#e5e5e5" />
        </mesh>

        <gridHelper args={[100, 100, 'gray', 'lightgray']} />

        {objects.map((obj: any) => (
          <TransformControls
            key={obj.id}
            mode="translate"
            enabled={selectedId === obj.id}
            onMouseDown={(e) => e.stopPropagation()}
            onObjectChange={(e) => {
              const mesh = e.target.object
              if (mesh) {
                const newObj = {
                  ...obj,
                  position: [mesh.position.x, mesh.position.y, mesh.position.z],
                  rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
                }
                updateObject(obj.id, newObj)
                supabase
                  .from('furniture_objects')
                  .update({ position: newObj.position, rotation: newObj.rotation })
                  .eq('id', obj.id)
              }
            }}
          >
            <FurniturePlane obj={obj} />
          </TransformControls>
        ))}

        <Stats />
      </Canvas>
    </div>
  )
}
