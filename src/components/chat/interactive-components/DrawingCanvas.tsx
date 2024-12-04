'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { UploadCloud, RotateCcw, Eraser, Paintbrush } from 'lucide-react'
import fetchGenerateAIResponse from '@/utils/fetchGenerateAIResponse'
import saveImage from '@/utils/saveImage'
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { GPT4oMessagesInput, O1MessagesInput } from '@/lib/types'

interface DrawingCanvasProps {
  messages: GPT4oMessagesInput[] | O1MessagesInput[];
  setMessages: React.Dispatch<React.SetStateAction<GPT4oMessagesInput[] | O1MessagesInput[]>>;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ messages, setMessages }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush')
  const [uploading, setUploading] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (canvas && container) {
      const { width, height } = container.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx) {
      ctx.beginPath()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      ctx.lineWidth = brushSize
      ctx.lineCap = 'round'
      ctx.strokeStyle = tool === 'eraser' ? 'white' : color

      ctx.lineTo(x, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  const uploadImage = async () => {
    const canvas = canvasRef.current
    if (canvas) {
      const image = canvas.toDataURL('image/png')
      const blob = await (await fetch(image)).blob()
      const file = new File([blob], 'drawing.png', { type: 'image/png' })

      const formData = new FormData()
      formData.append('image', file)

      setUploading(true)

      try {
        const imageUrl = await saveImage(formData)

        const message: ChatCompletionMessageParam = {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }

        setMessages([...messages, message])

        const reply = await fetchGenerateAIResponse([message])

        const newAiMessage: ChatCompletionMessageParam = {
          role: "assistant",
          content: reply.content
        }

        setMessages([...messages, newAiMessage])

        setIsSuccessful(true)
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('An error occurred while uploading the image.')
      } finally {
        setUploading(false)
      }
    } else {
      alert('Canvas ref is not available.')
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4 w-[250px] sm:w-[450px] md:w-[550px] bg-gray-100 rounded-lg shadow-lg">
      <div ref={containerRef} className="relative w-full aspect-square md:aspect-video">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          className="border-4 border-gray-300 rounded-lg shadow-inner bg-white w-full h-full"
        />
        <div className="absolute bottom-2 left-2 bg-white p-2 rounded-md shadow">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 border-none cursor-pointer"
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center space-x-2">
        <Button onClick={() => setTool('brush')} variant={tool === 'brush' ? 'default' : 'outline'}>
          <Paintbrush className="w-4 h-4 mr-2" />
          Brush
        </Button>
        <Button onClick={() => setTool('eraser')} variant={tool === 'eraser' ? 'default' : 'outline'}>
          <Eraser className="w-4 h-4 mr-2" />
          Eraser
        </Button>
      </div>
      <div className="w-full max-w-xs flex items-center space-x-2">
        <span className="text-sm font-medium">Size:</span>
        <Slider
          value={[brushSize]}
          onValueChange={(value) => setBrushSize(value[0])}
          max={20}
          step={1}
        />
        <span className="text-sm font-medium w-8">{brushSize}</span>
      </div>
      <div className="flex flex-wrap justify-center space-x-2">
        <Button onClick={clearCanvas} variant="destructive">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={uploadImage} variant="outline" disabled={uploading || isSuccessful}>
            <UploadCloud className="w-4 h-4 mr-2" />
            {uploading ? 'Submitting...' : 'Submit'}
          </Button>
      </div>
    </div>
  )
}

export default DrawingCanvas