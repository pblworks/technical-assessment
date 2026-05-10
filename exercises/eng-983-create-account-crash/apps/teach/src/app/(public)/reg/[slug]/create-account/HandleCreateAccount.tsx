'use client'

import { useAuth } from 'auth/clerk'
import { useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { completeRegistration } from '@/lib/registration/completeRegistration'
import {
  resolveBaseAccountRedirect,
  resolveCompleteRegistrationRedirect,
} from '@/lib/registration/redirects'
import { createAccountBase } from './action'
import { initializeAccountCreation } from './initializeAccountCreation'

export function HandleCreateAccount() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    if (!isLoaded) return

    // Prevents double-execution in React 18 StrictMode (dev/staging only).
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    if (!userId) {
      router.push(`/reg/${slug}/`)
      return
    }

    // Sequential flow: fetch data -> validate -> create base account -> determine next step
    const initialize = async () => {
      const result = await initializeAccountCreation(slug)

      if (result.type === 'validation_error') {
        if (result.validationResult.type === 'invalid') {
          switch (result.validationResult.reason) {
            case 'not_authenticated':
              router.push(`/reg/${slug}/`)
              return
            case 'personal_email':
            case 'invalid_domain':
              router.push(`/reg/${slug}/invalid-domain`)
              return
            case 'no_subscription':
              router.push(`/reg/${slug}/not-active-subscription`)
              return
          }
        }
        return
      }

      // Create base account (user + parent org connection)
      const baseResult = await createAccountBase(result.parentOrg)
      if (baseResult.type === 'error') {
        router.push(resolveBaseAccountRedirect(baseResult.reason, slug))
        return
      }

      // Complete registration: auto-connect single site, or redirect to site selection
      const registrationResult = await completeRegistration(result.parentOrg)
      if (registrationResult.type === 'error') {
        router.push(
          resolveCompleteRegistrationRedirect(registrationResult.reason, slug)
        )
        return
      }

      router.push(registrationResult.redirect)
    }

    void initialize()
  }, [isLoaded, userId, router, slug])

  return null
}
