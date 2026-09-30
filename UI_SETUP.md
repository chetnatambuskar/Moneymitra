# Splash + Onboarding Screens — What Was Added

Files added/changed inside `MoneyMitra/`:

- `src/theme/colors.ts` — shared brand colors sampled from your logo/designs
  (`primaryBlue #0C6EE7`, `primaryGreen #17962F`, text/border grays).
- `src/screens/SplashScreen.tsx` — the splash screen UI (logo, animated progress
  bar, "INITIALIZING SECURE CONNECTION" status text — 14px, Inter Regular, #757575,
  matching the Figma spec you shared).
- `src/screens/OnboardingScreen.tsx` — the swipeable walkthrough, all 3 slides
  (image header, Skip button, title, description, pagination dots, Back/Next/Start
  buttons).
- `src/components/OnboardingSlide.tsx` — one onboarding slide's layout (photo,
  soft white fade at the bottom of the photo, title, description).
- `src/components/PaginationDots.tsx` — the 3-dot pagination indicator.
- `src/assets/images/logo.png` — your MoneyMitra logo, taken from the file you uploaded.
- `src/assets/images/onboarding-1.jpg` — the "Easy Loan Process" background photo
  (downsized to 1200px wide to keep the app bundle small — swap in a higher-res
  export if you need it).
- `src/assets/images/onboarding-2.jpg` — the "EMI Based Repayment" background photo.
- `src/assets/images/onboarding-3.jpg` — the "Secure KYC Verification" background photo.
- `src/assets/fonts/Inter-Regular.ttf` — the Inter font (Regular weight) used by the status/description text.
- `react-native.config.js` — points RN's asset linker at `src/assets/fonts`.
- `src/screens/LoginScreen.tsx` — the Login/Signup screen (MoneyMitra wordmark,
  mobile number input with +91 prefix, terms checkbox with tappable links,
  Continue button).
- `src/screens/OtpVerificationScreen.tsx` — the OTP verification screen
  (MoneyMitra wordmark, entered number with an editable "Change" link, single
  OTP field with a live 00:59 countdown that turns into a "Resend" link at
  zero, Verify OTP button).
- `App.tsx` — now flows Splash → Onboarding → Login → OTP Verification
  (auto-advances after ~1.8s, then on "Get Started"/"Start"/"Skip", then on
  "Continue", then on "Verify OTP"). The entered mobile number is passed from
  Login into the OTP screen automatically. `onChangeNumber` sends the user
  back to Login; `onVerify` and `onResendOtp` are ready to wire up once you
  share the home/dashboard design.

## Notifications — newly added

- `src/screens/NotificationsScreen.tsx` — the notifications list (back arrow,
  "Notifications" title, bordered cards with title/summary/timestamp and a
  chevron, tapping a card opens the detail screen).
- `src/screens/NotificationDetailScreen.tsx` — the full notification detail
  (right-aligned timestamp, bordered card with the full message, a "Loan
  Details" bullet list, "What's Next?" and "Need Assistance?" sections).
- `src/data/notifications.ts` — shared `NotificationItem` type + the 5 mock
  "Loan Disbursed Sucessfully" notifications used by both screens (swap this
  for a real API response whenever you're ready).
- `App.tsx` — the bell icon on `HomeScreen` now opens `NotificationsScreen`;
  tapping any notification card opens `NotificationDetailScreen` for that
  item; the back arrow on each screen returns to the previous one.

## Settings, Profile, Document Verification, Privacy Policy & Terms — newly added

- `src/screens/SettingsScreen.tsx` — profile header (avatar, name, "100%
  Profile Completed"), the 5 rows (Profile, Document Verified, Privacy
  Policy, Terms & Conditions, Help & Support), red Logout row, bottom tab bar.
  Reachable from the "Settings" tab in the bottom bar on Home/Application.
- `src/screens/ProfileScreen.tsx` — "Personal Information" form (Full Name,
  DOB day/month/year, Gender, Email, Marital Status), opened from the
  "Profile" row. Name/Email are editable text fields; DOB/Gender/Marital
  Status are shown as dropdown-style rows (not wired to a picker yet — let
  me know if you want a real date/option picker added).
- `src/screens/DocumentVerifiedScreen.tsx` — the 3 verification rows (Selfie,
  Aadhaar, PAN) with green "Verified" badges, opened from "Document Verified".
- `src/screens/PrivacyPolicyScreen.tsx` / `src/screens/TermsConditionsScreen.tsx`
  — the full policy/terms text you provided, each in a bordered gray card,
  opened from their respective Settings rows.
- `src/components/SettingsRow.tsx` — one row in the Settings list.
- `src/data/profile.ts`, `src/data/documentVerification.ts`,
  `src/data/legalText.ts` — the mock user + verification list + the full
  Privacy Policy / Terms & Conditions paragraphs (swap for real data/API
  whenever ready).
- `App.tsx` — Settings tab now opens `SettingsScreen`; each row navigates to
  its own screen; **Logout** currently sends you back to the Login screen
  (change this to whatever your real sign-out flow should do). "Help &
  Support" is wired but a no-op until you share that screen's design.

## Application & Complete Process — newly added

- `src/screens/ApplicationScreen.tsx` — Active Loan / Closed Loan tabs,
  bordered gray loan cards with a status badge (Approved/Pending), amount,
  and a CTA button. Reachable from the "Application" tab in the bottom bar
  on Home. Tapping **"Complete your process"** opens `CompleteProcessScreen`.
- `src/screens/CompleteProcessScreen.tsx` — the 7-step checklist (numbered
  circle + step name + a green checkmark for completed steps / an empty
  circle for the rest), matching your third screenshot.
- `src/components/LoanApplicationCard.tsx` — one card in the Application list.
- `src/data/loanApplications.ts` — the 3 mock active-loan cards + an empty
  closed-loans list (shows "No closed loans yet." until you share that design).
- `src/data/loanProcessSteps.ts` — the 7 process steps and which are complete.
- `App.tsx` — Home's bottom tab bar now actually switches to
  `ApplicationScreen`; its own bottom tab bar switches back to Home. The
  "Final Loan Details" button is wired up but is a no-op until you share
  that screen's design.

## Icons — switched to react-native-vector-icons

Every icon across the app (bell, back arrows, chevrons, checkmarks, the
bottom-tab icons, the loan-category icons, the process-step checkmarks) now
uses `react-native-vector-icons` (`Ionicons` + `MaterialCommunityIcons`)
instead of emoji/text glyphs, so they render crisp and consistent on both
platforms.

**One-time setup**, since this is a new dependency:

1. From the `MoneyMitra/` folder, install it:
   ```bash
   npm install
   ```
   (`package.json` — which wasn't included in the earlier zips — has been
   added and already lists `react-native-vector-icons` + its TypeScript types.)
2. **Android** — already wired up: `android/app/build.gradle` now applies
   `react-native-vector-icons/fonts.gradle`, which copies the icon fonts in
   automatically on the next build.
3. **iOS** — after `bundle exec pod install` inside `ios/`, open
   `Info.plist` and add these font names under **Fonts provided by
   application** (`UIAppFonts`), alongside `Inter-Regular.ttf`:
   - `Ionicons.ttf`
   - `MaterialCommunityIcons.ttf`
   (Both files ship inside `node_modules/react-native-vector-icons/Fonts/`
   — drag them into the Xcode project the same way you did for the Inter font.)
4. Rebuild the app (`npx react-native run-android` / `run-ios`).

## Home screen — newly added

- `src/screens/HomeScreen.tsx` — the dashboard/home screen (greeting header
  with avatar + notification bell, dark "Instant Loan Upto 10 Lakh" hero card
  with a "Get Instant Loan" button, a 2-column grid of 6 loan category cards,
  bottom tab bar).
- `src/components/LoanCategoryCard.tsx` — one card in the loan-category grid
  (icon, title, subtitle).
- `src/components/BottomTabBar.tsx` — the Home / Application / Settings tab
  bar with the green active indicator.
- `App.tsx` — now flows Splash → Onboarding → Login → OTP → **Home**. `onVerify`
  on the OTP screen routes into `HomeScreen`.

Loan category icons and the bell icon currently use emoji, matching the
dependency-free approach of the rest of the app (no icon library is in
`package-lock.json` yet). If you'd like pixel-accurate icons instead, add
`react-native-vector-icons` (or export the icons as SVG/PNG from Figma) and
I'll swap them in.

The avatar is a placeholder gray circle by default — pass a real photo via
`<HomeScreen avatarUri="https://..." />` once you have a user photo source.

## All 3 onboarding slides are now complete

- Slide 1 — "Easy Loan Process" (desk/tablet photo)
- Slide 2 — "EMI Based Repayment" (phone calculator + cash photo)
- Slide 3 — "Secure KYC Verification" (fingerprint-scan photo)

Slide 1 shows a single full-width **Next** button. Slides 2 and 3 show a
**Back** button (outlined, green border/text) alongside **Next** — and the
last slide's button reads **Start** instead of Next, matching your designs.
**Skip** appears on every slide, top-right. All three background photos were
downsized to keep the app bundle small.

## One-time step: link the font

Run this once from the `MoneyMitra/` folder so the Inter font is copied into the
native projects:

```bash
npx react-native-asset
```

This copies the font into `android/app/src/main/assets/fonts/` automatically.
For **iOS**, also do the following (only needed once):

1. Open `ios/MoneyMitra.xcworkspace` in Xcode (run `pod install` inside `ios/` first if you haven't).
2. Drag `src/assets/fonts/Inter-Regular.ttf` into the Xcode project (check
   "Copy items if needed" and add it to the app target).
3. In `Info.plist`, add an entry under **Fonts provided by application**
   (`UIAppFonts`) with the value `Inter-Regular.ttf`.

Then rebuild the app:

```bash
npx react-native run-android
# or
npx react-native run-ios
```

## Tweaking the look

`SplashScreen` takes two optional props if you want to drive it from real load
progress instead of the built-in animation:

```tsx
<SplashScreen progress={0.6} statusText="SYNCING YOUR ACCOUNTS" />
```
