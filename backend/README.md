# MoneyMitra Backend

A Node.js (Express) + MySQL API for the MoneyMitra app: OTP login, profile,
the full loan checklist (personal/professional info, loan amount, document
upload, bank details, insurance payment, agreement e-sign, disbursement),
and notifications.

**Tested:** every endpoint below was run end-to-end against a real MySQL 8
database while building this — OTP login, loan creation, all three document
uploads, bank details with a file, the insurance summary math, agreement
OTP verification (including a rejected wrong OTP), and disbursement, in
that order, with the checklist correctly flipping each of the 7 steps to
"completed" as it went.

## 1. Prerequisites

- Node.js 18+ and npm
- MySQL 8 (or MariaDB 10.6+) running locally or reachable over the network

## 2. Create the database

```sh
mysql -u root -p -e "CREATE DATABASE moneymitra;"
mysql -u root -p moneymitra < schema.sql
```

This creates all 11 tables (`users`, `otps`, `loan_applications`,
`loan_personal_info`, `loan_professional_info`, `kyc_documents`,
`bank_details`, `insurance_payments`, `loan_agreements`,
`loan_process_steps`, `notifications`) with their foreign keys.

## 3. Configure environment variables

```sh
cp .env.example .env
```

Then edit `.env`:

```
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=moneymitra
JWT_SECRET=some_long_random_string   # change this for real use
```

Leave `OTP_DEBUG_MODE=true` for local testing — the OTP is returned in the
API response and printed to the server console, so you can log in without
an SMS provider. Set it to `false` and wire a real gateway in
`src/utils/otp.js` before shipping.

## 4. Install and run

```sh
npm install
npm run dev      # nodemon, restarts on file changes
# or
npm start        # plain node
```

You should see `MoneyMitra API listening on http://localhost:4000`. Confirm
with:

```sh
curl http://localhost:4000/health
```

## 5. How the endpoints map to the app's screens

All routes are under `/api`. Endpoints marked 🔒 require
`Authorization: Bearer <token>`, which you get from `verify-otp`.

| Screen | Method & path |
|---|---|
| LoginScreen | `POST /auth/send-otp` `{ mobileNumber }` |
| OtpVerificationScreen | `POST /auth/verify-otp` `{ mobileNumber, otp }` → `{ token, user }` |
| ProfileScreen | 🔒 `GET /profile`, `PUT /profile` |
| Home "Get Instant Loan" / category card | 🔒 `POST /loans` `{ loanTitle }` |
| ApplicationScreen tabs | 🔒 `GET /loans` |
| CompleteProcessScreen | 🔒 `GET /loans/:id` → loan + 7-row `steps[]` |
| PersonalInformationFormScreen | 🔒 `PUT /loans/:id/personal-info` |
| ProfessionalInformationScreen | 🔒 `PUT /loans/:id/professional-info` (also completes step 1) |
| SelectLoanAmountScreen | 🔒 `PUT /loans/:id/amount` `{ amount, tenureMonths }` (step 2) |
| Document Verified / Upload Document For Verification | 🔒 `GET /documents`, `POST /documents/:docType` (multipart `file`; `docType` is `selfie`\|`aadhaar`\|`pan`) |
| BankDetailsScreen | 🔒 `GET /loans/:id/bank-details`, `POST /loans/:id/bank-details` (multipart, step 4) |
| PaymentForInsuranceScreen | 🔒 `GET /loans/:id/insurance-summary`, `POST /loans/:id/insurance-payment` (step 5) |
| ReviewLoanDetailsScreen | 🔒 `GET /loans/:id/review` |
| AgreementPreviewScreen "Get OTP" | 🔒 `POST /loans/:id/agreement/send-otp` |
| AgreementOtpScreen "Verify" | 🔒 `POST /loans/:id/agreement/verify-otp` `{ otp }` (step 6) |
| AmountDisbursedScreen | 🔒 `POST /loans/:id/disburse` (step 7) |
| NotificationsScreen | 🔒 `GET /notifications` |
| NotificationDetailScreen | 🔒 `GET /notifications/:id`, `PUT /notifications/:id/read` |

Uploaded files are served back as plain URLs under
`http://localhost:4000/uploads/<category>/<file>`.

## 6. Quick manual test

```sh
# 1. request an OTP (dev mode returns it in the response)
curl -X POST localhost:4000/api/auth/send-otp \
  -H "Content-Type: application/json" -d '{"mobileNumber":"9876543210"}'

# 2. verify it (use the otp you got back above)
curl -X POST localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobileNumber":"9876543210","otp":"<OTP>"}'
# -> copy the "token" from the response

# 3. start a loan
curl -X POST localhost:4000/api/loans \
  -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" \
  -d '{"loanTitle":"Instant Loan"}'
```

Keep going through the table above in order (personal-info →
professional-info → amount → documents → bank-details →
insurance-summary/payment → review → agreement send/verify-otp → disburse)
and `GET /loans/:id` after each step to watch the checklist fill in.

## 7. What's stubbed and needs a real integration before production

- **SMS gateway** (`src/utils/otp.js`) — currently logs to the console.
- **Payment gateway** (`payInsurance` in `loanController.js`) — currently
  marks the charge paid immediately; call this from your gateway's
  success webhook instead.
- **Payout / disbursement** (`disburse` in `loanController.js`) — same:
  stubbed to succeed immediately, should be triggered by your payout
  provider's callback.
- **Agreement PDF generation** — `loan_agreements.agreement_file_url` is
  currently left `null`; generate a real PDF (e.g. with `pdfkit`) in
  `sendAgreementOtp` or a step before it, and store its URL there.
- File storage is local disk (`uploads/`). Swap `src/middleware/upload.js`
  for S3/Cloud Storage before deploying anywhere without a persistent disk.

## 8. Project structure

```
backend/
├── schema.sql              # run once to create all tables
├── .env.example
├── package.json
├── uploads/                 # local file storage (git-ignored)
└── src/
    ├── app.js               # Express app: middleware + route mounting
    ├── server.js             # entry point
    ├── config/db.js          # mysql2 connection pool
    ├── middleware/
    │   ├── auth.js            # JWT verification
    │   ├── upload.js          # multer disk storage
    │   └── errorHandler.js
    ├── utils/
    │   ├── jwt.js
    │   ├── otp.js              # generate/hash/send OTPs
    │   ├── loanMath.js         # shared EMI/summary calculations
    │   ├── apiResponse.js      # ok()/fail() response helpers
    │   └── asyncHandler.js
    ├── controllers/            # one per feature area
    └── routes/                 # one per feature area, mounted in app.js
```
