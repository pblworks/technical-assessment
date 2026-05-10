export type AvailableSite = {
  id: number
  name: string
  displayName?: string | null
}

export type SiteSelectionResult =
  | { type: 'needs_selection'; sites: AvailableSite[] }
  | { type: 'auto_selected'; siteId: number }

type ChildrenWithSubs = {
  id: number
  name: string
  displayName?: string | null
}[]

/**
 * Discovers available sites for account creation.
 * No validation logic, only site discovery.
 * Accepts pre-fetched data to avoid duplicate queries.
 *
 * @param childrenWithSubs - Children with active subscriptions (pre-fetched)
 */
export function getAvailableSites(
  childrenWithSubs: ChildrenWithSubs
): AvailableSite[] {
  return childrenWithSubs.map((child) => ({
    id: child.id,
    name: child.displayName ?? child.name,
    displayName: child.displayName,
  }))
}

/**
 * Determines if site selection UI is needed based on available sites.
 * Returns whether selection is needed or if a site can be auto-selected.
 */
export function determineSiteSelectionNeeded(
  sites: AvailableSite[]
): SiteSelectionResult {
  const uniqueSites = new Map<number, AvailableSite>()
  for (const site of sites) {
    if (!uniqueSites.has(site.id)) {
      uniqueSites.set(site.id, site)
    }
  }

  const dedupedSites = Array.from(uniqueSites.values())

  if (dedupedSites.length > 1) {
    // Multiple unique organizations - need site selection
    return { type: 'needs_selection', sites: dedupedSites }
  } else if (dedupedSites.length === 1) {
    // Only one unique organization - auto-select
    return { type: 'auto_selected', siteId: dedupedSites[0].id }
  }
  // No available sites - this shouldn't happen after validation
  // but we handle it gracefully
  throw new Error('No available sites found')
}
