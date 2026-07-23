/**
 * Curated select options for workspace/profile forms. Values are the ISO
 * codes the backend validates (ISO 4217 currencies, ISO 3166-1 alpha-2
 * countries, IANA timezones via Intl).
 */

export interface SelectOption {
  label: string;
  value: string;
}

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'SAR', label: 'SAR — Saudi Riyal' },
  { value: 'QAR', label: 'QAR — Qatari Riyal' },
  { value: 'KWD', label: 'KWD — Kuwaiti Dinar' },
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'PKR', label: 'PKR — Pakistani Rupee' },
  { value: 'BDT', label: 'BDT — Bangladeshi Taka' },
  { value: 'JPY', label: 'JPY — Japanese Yen' },
  { value: 'CNY', label: 'CNY — Chinese Yuan' },
  { value: 'AUD', label: 'AUD — Australian Dollar' },
  { value: 'CAD', label: 'CAD — Canadian Dollar' },
  { value: 'CHF', label: 'CHF — Swiss Franc' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'MYR', label: 'MYR — Malaysian Ringgit' },
  { value: 'TRY', label: 'TRY — Turkish Lira' },
  { value: 'EGP', label: 'EGP — Egyptian Pound' },
  { value: 'ZAR', label: 'ZAR — South African Rand' },
];

export const COUNTRY_OPTIONS: SelectOption[] = [
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'QA', label: 'Qatar' },
  { value: 'KW', label: 'Kuwait' },
  { value: 'BH', label: 'Bahrain' },
  { value: 'OM', label: 'Oman' },
  { value: 'IN', label: 'India' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'TR', label: 'Turkey' },
  { value: 'EG', label: 'Egypt' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'SG', label: 'Singapore' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  { value: 'ZA', label: 'South Africa' },
];

/** IANA timezone options from the runtime (full, always current). */
export function getTimezoneOptions(): SelectOption[] {
  const zones: string[] =
    typeof Intl.supportedValuesOf === 'function'
      ? Intl.supportedValuesOf('timeZone')
      : ['UTC', 'Asia/Dubai', 'Asia/Kolkata', 'Europe/London', 'America/New_York'];
  return zones.map((zone) => ({ value: zone, label: zone.replaceAll('_', ' ') }));
}
