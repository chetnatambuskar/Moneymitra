-- MoneyMitra database schema
-- Run this once against an empty database, e.g.:
--   mysql -u root -p moneymitra < schema.sql

CREATE TABLE IF NOT EXISTS users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  mobile_number   VARCHAR(15) NOT NULL UNIQUE,
  full_name       VARCHAR(150) NULL,
  email           VARCHAR(150) NULL,
  dob             DATE NULL,
  gender          ENUM('male', 'female', 'other') NULL,
  marital_status  VARCHAR(30) NULL,
  avatar_url      VARCHAR(255) NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- One-time passwords for both login (LoginScreen -> OtpVerificationScreen)
-- and agreement e-signing (AgreementPreviewScreen -> AgreementOtpScreen).
CREATE TABLE IF NOT EXISTS otps (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  mobile_number       VARCHAR(15) NOT NULL,
  otp_hash            VARCHAR(64) NOT NULL,
  purpose             ENUM('login', 'agreement') NOT NULL DEFAULT 'login',
  loan_application_id INT NULL,
  verified            BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at          TIMESTAMP NOT NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_otps_lookup (mobile_number, purpose, verified)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS loan_applications (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           INT NOT NULL,
  loan_title        VARCHAR(120) NOT NULL,
  amount            DECIMAL(12, 2) NULL,
  tenure_months     INT NULL,
  interest_rate     DECIMAL(5, 2) NOT NULL DEFAULT 12.00,
  processing_fee    DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
  insurance_charge  DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
  -- draft: form not finished. in_progress: checklist under way.
  -- approved: disbursed. pending: awaiting a step. closed: fully repaid.
  status            ENUM('draft', 'in_progress', 'pending', 'approved', 'closed') NOT NULL DEFAULT 'draft',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_loan_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- PersonalInformationFormScreen
CREATE TABLE IF NOT EXISTS loan_personal_info (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  loan_application_id INT NOT NULL UNIQUE,
  full_name           VARCHAR(150) NOT NULL,
  dob                 DATE NULL,
  gender              ENUM('male', 'female', 'other') NULL,
  email               VARCHAR(150) NULL,
  marital_status      VARCHAR(30) NULL,
  address             VARCHAR(255) NULL,
  purpose             VARCHAR(255) NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_personal_loan FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ProfessionalInformationScreen
CREATE TABLE IF NOT EXISTS loan_professional_info (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  loan_application_id INT NOT NULL UNIQUE,
  employment_type     ENUM('salaried', 'self_employed') NOT NULL,
  company_name        VARCHAR(150) NULL,
  work_email          VARCHAR(150) NULL,
  monthly_income      DECIMAL(12, 2) NULL,
  source_of_income    VARCHAR(100) NULL,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_professional_loan FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Shared KYC docs (selfie / aadhaar / pan). Belongs to the user, not one
-- loan, since a verified document is reused for future loans too —
-- mirrors Settings -> Document Verified as well as the checklist's own
-- "Document Verification" step.
CREATE TABLE IF NOT EXISTS kyc_documents (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  doc_type    ENUM('selfie', 'aadhaar', 'pan') NOT NULL,
  file_url    VARCHAR(255) NOT NULL,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_doc (user_id, doc_type),
  CONSTRAINT fk_doc_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- BankDetailsScreen
CREATE TABLE IF NOT EXISTS bank_details (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  loan_application_id   INT NOT NULL UNIQUE,
  bank_name             VARCHAR(150) NOT NULL,
  account_holder_name   VARCHAR(150) NOT NULL,
  account_number        VARCHAR(30) NOT NULL,
  ifsc_code             VARCHAR(11) NOT NULL,
  statement_file_url    VARCHAR(255) NULL,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bank_loan FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- PaymentForInsuranceScreen
CREATE TABLE IF NOT EXISTS insurance_payments (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  loan_application_id   INT NOT NULL UNIQUE,
  amount                DECIMAL(10, 2) NOT NULL,
  status                ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
  paid_at               TIMESTAMP NULL,
  CONSTRAINT fk_insurance_loan FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- AgreementPreviewScreen / AgreementOtpScreen
CREATE TABLE IF NOT EXISTS loan_agreements (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  loan_application_id   INT NOT NULL UNIQUE,
  agreement_file_url    VARCHAR(255) NULL,
  signed                BOOLEAN NOT NULL DEFAULT FALSE,
  signed_at             TIMESTAMP NULL,
  CONSTRAINT fk_agreement_loan FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- CompleteProcessScreen's 7-row checklist, one row per step per loan.
CREATE TABLE IF NOT EXISTS loan_process_steps (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  loan_application_id   INT NOT NULL,
  step_number           TINYINT NOT NULL,
  title                 VARCHAR(100) NOT NULL,
  completed             BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at          TIMESTAMP NULL,
  UNIQUE KEY uniq_loan_step (loan_application_id, step_number),
  CONSTRAINT fk_step_loan FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- NotificationsScreen / NotificationDetailScreen
CREATE TABLE IF NOT EXISTS notifications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(150) NOT NULL,
  message     TEXT NOT NULL,
  type        VARCHAR(50) NOT NULL DEFAULT 'general',
  data        JSON NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
