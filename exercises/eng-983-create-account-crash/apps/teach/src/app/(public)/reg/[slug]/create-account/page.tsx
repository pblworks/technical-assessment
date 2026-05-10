import { CircularProgress, Stack } from '@mui/material'
import { organization } from 'database/models'
import { redirect } from 'next/navigation'
import { getSession } from 'auth'
import { CenteredLayout } from '@/components/CenteredLayout'
import { RegistrationProgress } from '@/components/RegistrationProgress'
import { getAvailableSites, determineSiteSelectionNeeded } from './sites'
import { HandleCreateAccount } from './HandleCreateAccount'

async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await getSession()

  if (session.hasOrgSubscription) {
    redirect('/home')
  }

  // Determine if the "select site" step should be shown in the progress indicator
  const parentOrg = await organization.getOrganizationBySlug(slug)
  const childrenWithSubs = await organization.getChildrenWithActiveSubscriptions(
    parentOrg.originalId
  )
  const availableSites = getAvailableSites(childrenWithSubs)
  const selectionResult = determineSiteSelectionNeeded(availableSites)
  const showSiteStep = selectionResult.type === 'needs_selection'

  return (
    <CenteredLayout
      progressIndicator={
        <RegistrationProgress currentStep="account" showSiteStep={showSiteStep} />
      }
    >
      <Stack
        sx={{
          minHeight: 200,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={80} />
      </Stack>
      <HandleCreateAccount />
    </CenteredLayout>
  )
}

// eslint-disable-next-line import/no-default-export -- Next.js default policy
export default Page
