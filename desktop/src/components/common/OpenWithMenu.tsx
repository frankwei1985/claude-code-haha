import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { Globe, ExternalLink, FileText } from 'lucide-react'
import { TargetIcon } from './TargetIcon'
import type { OpenWithItem } from '../../lib/openWithItems'

type Props = {
  items: OpenWithItem[]
  anchor: { top: number; bottom: number; left: number; right: number }
  onClose: () => void
}

function ItemIcon({ item }: { item: OpenWithItem }) {
  if ((item.icon === 'ide' || item.icon === 'file-manager') && item.target) return <TargetIcon target={item.target} size={20} />
  if (item.icon === 'in-app-browser') return <Globe size={18} strokeWidth={1.9} />
  if (item.icon === 'preview') return <FileText size={18} strokeWidth={1.9} />
  return <ExternalLink size={18} strokeWidth={1.9} />
}

export function OpenWithMenu({ items, anchor, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose() }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [onClose])

  return createPortal(
    <div
      ref={ref}
      role="menu"
      className="fixed z-50 min-w-[220px] overflow-hidden rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-[var(--shadow-dropdown)]"
      style={{ top: anchor.bottom + 6, left: Math.min(anchor.left, window.innerWidth - 240) }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          onClick={() => { item.onSelect(); onClose() }}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <span className="flex h-6 w-6 items-center justify-center text-[var(--color-text-secondary)]"><ItemIcon item={item} /></span>
          <span className="min-w-0 truncate">{item.label}</span>
        </button>
      ))}
    </div>,
    document.body,
  )
}
