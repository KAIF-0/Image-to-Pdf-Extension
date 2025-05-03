import { Download, FileText, Trash2, UploadCloud } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import "./style.css"

import ImagePreview from "./components/ImagePreview"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { generatePDF } from "./lib/pdfGenerator"
import { cn } from "./lib/utils"

const Index = () => {
  const [images, setImages] = useState<string[]>([])
  const [fileName, setFileName] = useState<string>("")
  const [isDownloading, setIsDownloading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (files: FileList) => {
    const fileArray = Array.from(files)
    if (fileArray.length === 0) return

    fileArray.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages((prev) => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          handleImageUpload([file] as unknown as FileList)
          e.preventDefault()
          break
        }
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDownloadPDF = async () => {
    if (images.length === 0 || !fileName) {
      return
    }

    try {
      setIsDownloading(true)
      const url = await generatePDF(images, fileName)

      //downloading via dom
      if (url) {
        const link = document.createElement("a")
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClearAll = () => {
    setImages([])
  }

  useEffect(() => {
    document.addEventListener("paste", handlePaste)

    return () => {
      document.removeEventListener("paste", handlePaste)
    }
  }, [])

  return (
    <div className="size-max bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <div className="p-6 space-y-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Imagify PDF Wizard
            </h1>
            <p className="text-gray-500 mt-1">
              Convert your images to PDF in seconds
            </p>
          </div>

          <div
            className="border-2 border-dashed rounded-lg p-6 transition-all border-gray-300 hover:border-gray-400"
            onClick={() => fileInputRef.current?.click()}>
            <div className="flex flex-col items-center justify-center text-center">
              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Drag & drop images here
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, JPEG, GIF up to 10MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files)
                }
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}>
                Select Files
              </Button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="flex items-center gap-2 text-base text-gray-600">
              <span>File name:</span>
              <input
                type="text"
                placeholder="Enter PDF file name"
                className="flex-1 px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          )}

          {images.length > 0 && (
            <div className="space-y-4">
              {/* <Separator /> */}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-medium text-gray-700">
                    {images.length} {images.length === 1 ? "Image" : "Images"}{" "}
                    Selected
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImages([])}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {images.map((image, index) => (
                    <ImagePreview
                      key={index}
                      image={image}
                      onRemove={() => handleRemoveImage(index)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className={cn(
                    "w-full",
                    isDownloading
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700",
                    images.length > 0 && fileName
                      ? "hover:bg-blue-800"
                      : "opacity-50 cursor-not-allowed"
                  )}>
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download PDF"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Index
