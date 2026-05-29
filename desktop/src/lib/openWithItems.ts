import type { OpenTarget } from '../stores/openTargetStore'

export type OpenWithIcon = 'in-app-browser' | 'system' | 'ide' | 'file-manager' | 'preview'

export type OpenWithItem = {
  id: string
  label: string
  icon: OpenWithIcon
  target?: OpenTarget          // present for ide/file-manager items (to render its favicon)
  onSelect: () => void
}

export type OpenWithDeps = {
  openInAppBrowser: (url: string) => void
  openSystem: (urlOrPath: string) => void
  openWorkspacePreview: (relPath: string) => void
  openTarget: (targetId: string, absolutePath: string) => void
  t: (key: string, vars?: Record<string, string>) => string
}

export type OpenWithContext =
  | { kind: 'url'; url: string }
  | { kind: 'file'; absolutePath: string; relPath?: string; previewable?: boolean; inAppBrowserUrl?: string }

export function buildOpenWithItems(ctx: OpenWithContext, targets: OpenTarget[], deps: OpenWithDeps): OpenWithItem[] {
  const items: OpenWithItem[] = []
  if (ctx.kind === 'url') {
    items.push({ id: 'in-app', label: deps.t('openWith.inAppBrowser'), icon: 'in-app-browser', onSelect: () => deps.openInAppBrowser(ctx.url) })
    items.push({ id: 'system', label: deps.t('openWith.systemBrowser'), icon: 'system', onSelect: () => deps.openSystem(ctx.url) })
    return items
  }
  if (ctx.previewable && ctx.relPath != null) {
    const relPath = ctx.relPath
    items.push({ id: 'preview', label: deps.t('openWith.workspacePreview'), icon: 'preview', onSelect: () => deps.openWorkspacePreview(relPath) })
  }
  if (ctx.inAppBrowserUrl) {
    const url = ctx.inAppBrowserUrl
    items.push({ id: 'in-app', label: deps.t('openWith.inAppBrowser'), icon: 'in-app-browser', onSelect: () => deps.openInAppBrowser(url) })
  }
  for (const target of targets.filter((x) => x.kind === 'ide')) {
    items.push({ id: `ide:${target.id}`, label: deps.t('openWith.openInTarget', { target: target.label }), icon: 'ide', target, onSelect: () => deps.openTarget(target.id, ctx.absolutePath) })
  }
  for (const target of targets.filter((x) => x.kind === 'file_manager')) {
    items.push({ id: `fm:${target.id}`, label: deps.t('openWith.revealInTarget', { target: target.label }), icon: 'file-manager', target, onSelect: () => deps.openTarget(target.id, ctx.absolutePath) })
  }
  items.push({ id: 'system', label: deps.t('openWith.systemDefault'), icon: 'system', onSelect: () => deps.openSystem(ctx.absolutePath) })
  return items
}
