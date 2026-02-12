"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface StorageErrorProps {
  onReset: () => void
}

export function StorageError({ onReset }: StorageErrorProps) {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 max-w-sm text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Data could not be loaded</h2>
        <p className="text-muted-foreground">
          Your saved data appears to be corrupted. You can reset the app to
          start fresh.
        </p>
        <Button variant="destructive" onClick={onReset}>
          Reset App
        </Button>
      </div>
    </div>
  )
}
