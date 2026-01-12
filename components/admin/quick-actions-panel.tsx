'use client'

import { useState } from 'react'
import { RefreshCw, Trash2, Download, HardDrive, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface QuickActionsPanelProps {
  onTriggerFullSync: () => Promise<void>
  onClearCache: () => Promise<void>
  onExportData: () => Promise<void>
  onSystemBackup: () => Promise<void>
  isLoading?: boolean
}

type ActionType = 'sync' | 'cache' | 'export' | 'backup' | null

const actions = [
  {
    id: 'sync' as const,
    title: 'Trigger Full Sync',
    description: 'Synchronize data from all company APIs',
    icon: RefreshCw,
    color: '#0066FF',
    bgColor: 'bg-primary/10',
    confirmTitle: 'Trigger Full Sync?',
    confirmDescription:
      'This will synchronize data from all 17 company APIs. This may take several minutes.',
  },
  {
    id: 'cache' as const,
    title: 'Clear Cache',
    description: 'Clear all system cache data',
    icon: Trash2,
    color: '#E63946',
    bgColor: 'bg-destructive/10',
    confirmTitle: 'Clear System Cache?',
    confirmDescription:
      'This will clear all cached data. Users may experience slower load times temporarily.',
  },
  {
    id: 'export' as const,
    title: 'Export All Data',
    description: 'Download complete system data export',
    icon: Download,
    color: '#00B87C',
    bgColor: 'bg-success/10',
    confirmTitle: 'Export System Data?',
    confirmDescription:
      'This will generate and download a complete export of all system data in JSON format.',
  },
  {
    id: 'backup' as const,
    title: 'System Backup',
    description: 'Create a full system backup',
    icon: HardDrive,
    color: '#7B61FF',
    bgColor: 'bg-secondary/10',
    confirmTitle: 'Create System Backup?',
    confirmDescription:
      'This will create a complete backup of the database and all system files.',
  },
]

export function QuickActionsPanel({
  onTriggerFullSync,
  onClearCache,
  onExportData,
  onSystemBackup,
  isLoading = false,
}: QuickActionsPanelProps) {
  const [confirmDialog, setConfirmDialog] = useState<ActionType>(null)
  const [runningAction, setRunningAction] = useState<ActionType>(null)

  const handleAction = async (actionType: ActionType) => {
    if (!actionType) return

    setRunningAction(actionType)
    setConfirmDialog(null)

    try {
      switch (actionType) {
        case 'sync':
          await onTriggerFullSync()
          break
        case 'cache':
          await onClearCache()
          break
        case 'export':
          await onExportData()
          break
        case 'backup':
          await onSystemBackup()
          break
      }
    } finally {
      setRunningAction(null)
    }
  }

  const activeAction = actions.find((a) => a.id === confirmDialog)

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-500">
            System management actions
          </p>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon
            const isRunning = runningAction === action.id

            return (
              <button
                key={action.id}
                onClick={() => setConfirmDialog(action.id)}
                disabled={!!runningAction}
                className={cn(
                  'p-4 rounded-lg border border-transparent text-left transition-all',
                  'hover:border-gray-200 hover:shadow-sm',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  action.bgColor
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    {isRunning ? (
                      <Loader2
                        className="h-5 w-5 animate-spin"
                        style={{ color: action.color }}
                      />
                    ) : (
                      <Icon
                        className="h-5 w-5"
                        style={{ color: action.color }}
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {isRunning ? 'Running...' : action.description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeAction?.confirmTitle}</DialogTitle>
            <DialogDescription>
              {activeAction?.confirmDescription}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="secondary"
              onClick={() => setConfirmDialog(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleAction(confirmDialog)}
              style={
                activeAction
                  ? { backgroundColor: activeAction.color }
                  : undefined
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
